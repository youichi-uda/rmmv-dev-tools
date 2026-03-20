import * as fs from 'fs';
import * as path from 'path';

/**
 * Minimal source map parser (no external dependencies).
 * Handles standard V3 source maps with VLQ-encoded mappings.
 */

interface SourceMapData {
  version: number;
  file?: string;
  sourceRoot?: string;
  sources: string[];
  mappings: string;
}

interface Mapping {
  genLine: number;    // 0-based generated line
  genColumn: number;  // 0-based generated column
  srcIndex: number;   // index into sources[]
  srcLine: number;    // 0-based source line
  srcColumn: number;  // 0-based source column
}

export interface SourceLocation {
  sourcePath: string;
  line: number;   // 0-based
  column: number; // 0-based
}

export class SourceMap {
  private mappings: Mapping[];
  private sources: string[];    // resolved absolute paths
  private genFilePath: string;  // absolute path of generated .js file

  private constructor(mappings: Mapping[], sources: string[], genFilePath: string) {
    this.mappings = mappings;
    this.sources = sources;
    this.genFilePath = genFilePath;
  }

  /**
   * Load a source map from a .js.map file path.
   * Returns undefined if the file doesn't exist or is invalid.
   */
  static load(mapFilePath: string, genFilePath: string): SourceMap | undefined {
    try {
      const json = fs.readFileSync(mapFilePath, 'utf-8');
      const data: SourceMapData = JSON.parse(json);
      if (data.version !== 3 || !data.mappings || !data.sources) return undefined;

      const mapDir = path.dirname(mapFilePath);
      const sourceRoot = data.sourceRoot || '';
      const resolvedSources = data.sources.map(s =>
        path.resolve(mapDir, sourceRoot, s)
      );

      const mappings = decodeMappings(data.mappings);
      return new SourceMap(mappings, resolvedSources, genFilePath);
    } catch {
      return undefined;
    }
  }

  /** Given a source (.ts) line, find the generated (.js) line. */
  sourceToGenerated(sourcePath: string, srcLine: number): number | undefined {
    const normSource = normalizePath(sourcePath);
    const srcIndex = this.sources.findIndex(s => normalizePath(s) === normSource);
    if (srcIndex === -1) return undefined;

    // Find the closest mapping for this source line
    let bestMapping: Mapping | undefined;
    for (const m of this.mappings) {
      if (m.srcIndex === srcIndex && m.srcLine === srcLine) {
        bestMapping = m;
        break; // first match is fine (mappings are ordered by generated position)
      }
    }

    // If exact line not found, find the nearest line after
    if (!bestMapping) {
      let closest: Mapping | undefined;
      for (const m of this.mappings) {
        if (m.srcIndex === srcIndex && m.srcLine >= srcLine) {
          if (!closest || m.srcLine < closest.srcLine) {
            closest = m;
          }
        }
      }
      bestMapping = closest;
    }

    return bestMapping?.genLine;
  }

  /** Given a generated (.js) position, find the source (.ts) location. */
  generatedToSource(genLine: number, genColumn?: number): SourceLocation | undefined {
    // Find the best mapping for this generated line
    let best: Mapping | undefined;
    for (const m of this.mappings) {
      if (m.genLine === genLine) {
        if (!best || (genColumn !== undefined && Math.abs(m.genColumn - genColumn) < Math.abs(best.genColumn - genColumn))) {
          best = m;
        }
        if (!genColumn) break; // take first match if no column specified
      }
    }

    if (!best || best.srcIndex >= this.sources.length) return undefined;

    return {
      sourcePath: this.sources[best.srcIndex],
      line: best.srcLine,
      column: best.srcColumn,
    };
  }

  /** Get the generated (.js) file path. */
  getGenFilePath(): string {
    return this.genFilePath;
  }

  /** Get all resolved source file paths. */
  getSourcePaths(): string[] {
    return this.sources;
  }
}

// ── VLQ decoder ────────────────────────────────────────────────────────

const VLQ_BASE_SHIFT = 5;
const VLQ_BASE = 1 << VLQ_BASE_SHIFT;
const VLQ_BASE_MASK = VLQ_BASE - 1;
const VLQ_CONTINUATION_BIT = VLQ_BASE;

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const b64Lookup = new Map<string, number>();
for (let i = 0; i < B64_CHARS.length; i++) {
  b64Lookup.set(B64_CHARS[i], i);
}

function decodeVlq(encoded: string, index: number): [value: number, newIndex: number] {
  let result = 0;
  let shift = 0;
  let continuation: boolean;

  do {
    const char = encoded[index++];
    const digit = b64Lookup.get(char);
    if (digit === undefined) throw new Error(`Invalid base64 char: ${char}`);
    continuation = (digit & VLQ_CONTINUATION_BIT) !== 0;
    result += (digit & VLQ_BASE_MASK) << shift;
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  // Convert from VLQ sign representation
  const isNegative = (result & 1) !== 0;
  result >>= 1;
  return [isNegative ? -result : result, index];
}

function decodeMappings(mappingsStr: string): Mapping[] {
  const mappings: Mapping[] = [];
  let genLine = 0;
  let genColumn = 0;
  let srcIndex = 0;
  let srcLine = 0;
  let srcColumn = 0;

  const lines = mappingsStr.split(';');

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    genLine = lineIdx;
    genColumn = 0; // reset column per generated line

    const segments = lines[lineIdx].split(',');
    for (const segment of segments) {
      if (segment.length === 0) continue;

      let idx = 0;
      let value: number;

      // Field 1: generated column (delta)
      [value, idx] = decodeVlq(segment, idx);
      genColumn += value;

      if (idx < segment.length) {
        // Field 2: source index (delta)
        [value, idx] = decodeVlq(segment, idx);
        srcIndex += value;

        // Field 3: source line (delta)
        [value, idx] = decodeVlq(segment, idx);
        srcLine += value;

        // Field 4: source column (delta)
        [value, idx] = decodeVlq(segment, idx);
        srcColumn += value;

        mappings.push({
          genLine,
          genColumn,
          srcIndex,
          srcLine,
          srcColumn,
        });
      }
    }
  }

  return mappings;
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').toLowerCase();
}
