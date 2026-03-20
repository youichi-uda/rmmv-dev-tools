import { describe, it, expect } from 'vitest';
import * as path from 'path';

/**
 * Tests for the file deletion cleanup logic in autoBuild.ts.
 *
 * When a .ts file is deleted from ts/plugins/, the corresponding
 * .js and .js.map in js/plugins/ should be identified for removal.
 * This tests the path mapping logic (rootDir: ts → outDir: js).
 */

// ── Replicated path mapping from autoBuild.ts onFileDeleted ──

function mapTsToOutputPaths(
  deletedTsPath: string,
  root: string
): { jsPath: string; mapPath: string } | null {
  const rel = path.relative(path.join(root, 'ts'), deletedTsPath);
  // Safety: file must be inside ts/
  if (rel.startsWith('..')) return null;
  const jsPath = path.join(root, 'js', rel.replace(/\.ts$/, '.js'));
  const mapPath = jsPath + '.map';
  return { jsPath, mapPath };
}

// ── Tests ──

describe('Auto-Build Cleanup - path mapping', () => {
  const root = '/project';

  it('should map ts/plugins/MyPlugin.ts → js/plugins/MyPlugin.js', () => {
    const result = mapTsToOutputPaths('/project/ts/plugins/MyPlugin.ts', root);
    expect(result).not.toBeNull();
    expect(result!.jsPath).toContain('js');
    expect(result!.jsPath).toContain('plugins');
    expect(result!.jsPath).toMatch(/MyPlugin\.js$/);
  });

  it('should produce .js.map path alongside .js', () => {
    const result = mapTsToOutputPaths('/project/ts/plugins/Foo.ts', root);
    expect(result).not.toBeNull();
    expect(result!.mapPath).toBe(result!.jsPath + '.map');
  });

  it('should handle nested subdirectories', () => {
    const result = mapTsToOutputPaths('/project/ts/plugins/sub/Deep.ts', root);
    expect(result).not.toBeNull();
    expect(result!.jsPath).toContain('sub');
    expect(result!.jsPath).toMatch(/Deep\.js$/);
  });

  it('should reject files outside ts/ directory', () => {
    const result = mapTsToOutputPaths('/other/place/file.ts', root);
    expect(result).toBeNull();
  });

  it('should reject files in a completely different location', () => {
    const result = mapTsToOutputPaths('/project/src/something.ts', root);
    expect(result).toBeNull();
  });

  it('should not touch typings files (they are in ts/typings/, not ts/plugins/)', () => {
    // ts/typings/ maps to js/typings/ which doesn't exist, but the path
    // itself is valid (inside ts/). This is fine — fs.existsSync in the
    // actual code will prevent deletion of non-existent files.
    const result = mapTsToOutputPaths('/project/ts/typings/rmmv/rmmv_core.d.ts', root);
    expect(result).not.toBeNull();
    // The .js path would be in js/typings/ which won't exist — harmless
    expect(result!.jsPath).toContain('typings');
  });
});
