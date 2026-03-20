import * as path from 'path';
import * as fs from 'fs';
import { SourceMap, type SourceLocation } from './sourceMap';

/**
 * Maps between chrome-extension:// URLs (NW.js) and local file paths.
 * Also handles source map resolution for TypeScript debugging.
 *
 * NW.js loads game files as chrome-extension://<ID>/js/rpg_core.js.
 * The extension ID is detected from Debugger.scriptParsed events.
 */
export class PathMapper {
  private extensionId: string | undefined;
  private webRoot: string;
  /** scriptId → local .js file path */
  private scriptIdToPath = new Map<string, string>();
  /** scriptId → chrome-extension URL */
  private scriptIdToUrl = new Map<string, string>();
  /** Generated .js path (normalized) → SourceMap */
  private sourceMaps = new Map<string, SourceMap>();
  /** Source .ts path (normalized) → generated .js path (normalized) */
  private sourceToGen = new Map<string, string>();

  constructor(webRoot: string) {
    this.webRoot = webRoot;
  }

  /**
   * Register a script from Debugger.scriptParsed.
   * Auto-detects the chrome-extension ID from the first matching URL.
   * Loads source maps if available.
   */
  registerScript(scriptId: string, url: string, sourceMapURL?: string): void {
    this.scriptIdToUrl.set(scriptId, url);

    const match = url.match(/^chrome-extension:\/\/([^/]+)\/(.+)$/);
    if (!match) return;

    if (!this.extensionId) {
      this.extensionId = match[1];
    }

    const relativePath = match[2];
    const localPath = path.join(this.webRoot, relativePath);
    this.scriptIdToPath.set(scriptId, localPath);

    // Try to load source map
    let loaded = false;
    if (sourceMapURL && !sourceMapURL.startsWith('data:')) {
      loaded = this.tryLoadSourceMap(localPath, sourceMapURL);
    }
    // Fallback: check for .js.map file
    if (!loaded) {
      const mapPath = localPath + '.map';
      if (fs.existsSync(mapPath)) {
        const sm = SourceMap.load(mapPath, localPath);
        if (sm) {
          this.registerSourceMap(localPath, sm);
        }
      }
    }
  }

  private tryLoadSourceMap(jsPath: string, sourceMapURL: string): boolean {
    try {
      let mapPath: string;
      if (path.isAbsolute(sourceMapURL)) {
        mapPath = sourceMapURL;
      } else {
        mapPath = path.resolve(path.dirname(jsPath), sourceMapURL);
      }
      if (!fs.existsSync(mapPath)) return false;
      const sm = SourceMap.load(mapPath, jsPath);
      if (sm) {
        this.registerSourceMap(jsPath, sm);
        return true;
      }
    } catch {
      // Fall through
    }
    return false;
  }

  private registerSourceMap(jsPath: string, sm: SourceMap): void {
    const normJs = normalizePath(jsPath);
    this.sourceMaps.set(normJs, sm);

    for (const srcPath of sm.getSourcePaths()) {
      this.sourceToGen.set(normalizePath(srcPath), normJs);
    }
  }

  /**
   * Resolve a breakpoint location. If the file is a .ts source with a source map,
   * returns the generated .js path and mapped line. Otherwise returns as-is.
   */
  resolveBreakpointLocation(localPath: string, line: number): { jsPath: string; line: number } {
    const normPath = normalizePath(localPath);
    const genPath = this.sourceToGen.get(normPath);

    if (genPath) {
      const sm = this.sourceMaps.get(genPath);
      if (sm) {
        const genLine = sm.sourceToGenerated(localPath, line);
        if (genLine !== undefined) {
          return { jsPath: sm.getGenFilePath(), line: genLine };
        }
      }
    }

    return { jsPath: localPath, line };
  }

  /**
   * Map a generated location back to source (.ts). Falls back to .js path.
   */
  resolveSourceLocation(jsPath: string, line: number, column?: number): { path: string; line: number; column: number } {
    const normJs = normalizePath(jsPath);
    const sm = this.sourceMaps.get(normJs);

    if (sm) {
      const loc = sm.generatedToSource(line, column);
      if (loc) {
        return { path: loc.sourcePath, line: loc.line, column: loc.column };
      }
    }

    return { path: jsPath, line, column: column ?? 0 };
  }

  /** Convert a local file path to a urlRegex for Debugger.setBreakpointByUrl. */
  toUrlRegex(localPath: string): string {
    const normalized = localPath.replace(/\\/g, '/');
    const webRootNorm = this.webRoot.replace(/\\/g, '/');

    let relativePath: string;
    if (normalized.toLowerCase().startsWith(webRootNorm.toLowerCase() + '/')) {
      relativePath = normalized.substring(webRootNorm.length + 1);
    } else {
      relativePath = path.relative(this.webRoot, localPath).replace(/\\/g, '/');
    }

    // Escape regex special chars in the path
    const escaped = relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `chrome-extension://[^/]+/${escaped}`;
  }

  /** Convert a CDP script URL to a local file path. */
  urlToLocalPath(url: string): string | undefined {
    const match = url.match(/^chrome-extension:\/\/[^/]+\/(.+)$/);
    if (!match) return undefined;
    return path.join(this.webRoot, match[1]);
  }

  /** Get local path for a scriptId. */
  getLocalPath(scriptId: string): string | undefined {
    return this.scriptIdToPath.get(scriptId);
  }

  /** Get URL for a scriptId. */
  getUrl(scriptId: string): string | undefined {
    return this.scriptIdToUrl.get(scriptId);
  }

  /** Check if a source file has an associated source map. */
  hasSourceMap(localPath: string): boolean {
    return this.sourceToGen.has(normalizePath(localPath));
  }
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').toLowerCase();
}
