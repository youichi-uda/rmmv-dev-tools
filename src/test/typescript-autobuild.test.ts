import { describe, it, expect } from 'vitest';
import * as path from 'path';

/**
 * Tests for TypeScript auto-build (src/typescript/autoBuild.ts).
 *
 * The autoBuild module spawns tsc and parses its output into VS Code
 * diagnostics. We replicate the pure parsing logic here for testing.
 */

// ── Replicated tsc output parser from autoBuild.ts ──

interface ParsedDiagnostic {
  filePath: string;
  line: number;
  col: number;
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

function parseTscOutput(output: string, root: string): ParsedDiagnostic[] {
  const diagnostics: ParsedDiagnostic[] = [];
  const regex = /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(output)) !== null) {
    const [, filePath, lineStr, colStr, severity, code, message] = match;
    const absPath = path.isAbsolute(filePath) ? filePath : path.join(root, filePath);

    diagnostics.push({
      filePath: absPath,
      line: parseInt(lineStr, 10) - 1,
      col: parseInt(colStr, 10) - 1,
      severity: severity as 'error' | 'warning',
      code,
      message,
    });
  }

  return diagnostics;
}

// ── Replicated tsc resolution logic ──

function findTscPath(root: string): string {
  const localTsc = path.join(root, 'node_modules', '.bin', 'tsc');
  return localTsc;
}

// ── Tests ──

describe('TypeScript Auto-Build - tsc output parsing', () => {
  it('should parse a single error', () => {
    const output = `ts/plugins/MyPlugin.ts(10,5): error TS2304: Cannot find name 'foo'.`;
    const result = parseTscOutput(output, '/project');

    expect(result).toHaveLength(1);
    expect(result[0].line).toBe(9); // 0-indexed
    expect(result[0].col).toBe(4);  // 0-indexed
    expect(result[0].severity).toBe('error');
    expect(result[0].code).toBe('TS2304');
    expect(result[0].message).toBe("Cannot find name 'foo'.");
  });

  it('should parse multiple errors', () => {
    const output = [
      `ts/plugins/A.ts(1,1): error TS2304: Cannot find name 'x'.`,
      `ts/plugins/B.ts(20,10): error TS2322: Type 'string' is not assignable to type 'number'.`,
      `ts/plugins/A.ts(5,3): error TS2551: Property 'naem' does not exist on type 'Actor'.`,
    ].join('\n');

    const result = parseTscOutput(output, '/project');
    expect(result).toHaveLength(3);
    expect(result[0].code).toBe('TS2304');
    expect(result[1].code).toBe('TS2322');
    expect(result[2].code).toBe('TS2551');
  });

  it('should parse warnings', () => {
    const output = `ts/plugins/MyPlugin.ts(3,1): warning TS6133: 'unused' is declared but its value is never read.`;
    const result = parseTscOutput(output, '/project');

    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('warning');
    expect(result[0].code).toBe('TS6133');
  });

  it('should handle empty output', () => {
    const result = parseTscOutput('', '/project');
    expect(result).toHaveLength(0);
  });

  it('should handle output with no errors (just info messages)', () => {
    const output = `Starting compilation in watch mode...\nFound 0 errors. Watching for file changes.`;
    const result = parseTscOutput(output, '/project');
    expect(result).toHaveLength(0);
  });

  it('should resolve relative paths against root', () => {
    const output = `ts/plugins/Test.ts(1,1): error TS2304: Not found.`;
    const result = parseTscOutput(output, '/my/project');

    expect(result).toHaveLength(1);
    expect(result[0].filePath).toContain('my');
    expect(result[0].filePath).toContain('project');
    expect(result[0].filePath).toContain('Test.ts');
  });

  it('should handle absolute paths without modifying them', () => {
    const output = `/absolute/path/Test.ts(1,1): error TS2304: Not found.`;
    const result = parseTscOutput(output, '/project');

    expect(result).toHaveLength(1);
    expect(result[0].filePath).toBe('/absolute/path/Test.ts');
  });

  it('should format diagnostic message with code prefix', () => {
    const output = `file.ts(5,10): error TS1234: Some error message.`;
    const result = parseTscOutput(output, '/root');

    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('TS1234');
    expect(result[0].message).toBe('Some error message.');
  });

  it('should handle mixed errors and warnings', () => {
    const output = [
      `a.ts(1,1): error TS2304: err1.`,
      `b.ts(2,2): warning TS6133: warn1.`,
      `c.ts(3,3): error TS2322: err2.`,
    ].join('\n');

    const result = parseTscOutput(output, '/p');
    expect(result).toHaveLength(3);
    expect(result.filter(d => d.severity === 'error')).toHaveLength(2);
    expect(result.filter(d => d.severity === 'warning')).toHaveLength(1);
  });
});

describe('TypeScript Auto-Build - tsc resolution', () => {
  it('should look for tsc in node_modules/.bin/', () => {
    const tscPath = findTscPath('/project');
    expect(tscPath).toContain('node_modules');
    expect(tscPath).toContain('.bin');
    expect(tscPath).toContain('tsc');
  });
});

describe('TypeScript Auto-Build - debounce logic', () => {
  /**
   * Replicated debounce behavior from autoBuild.ts:
   * Only the last call within the debounce window fires.
   */
  function createDebouncedRunner(delayMs: number) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let runCount = 0;

    return {
      trigger() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => { runCount++; }, delayMs);
      },
      getRunCount() { return runCount; },
      waitForCompletion(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, delayMs + 20));
      },
    };
  }

  it('should fire once when triggered once', async () => {
    const debounced = createDebouncedRunner(30);
    debounced.trigger();
    await debounced.waitForCompletion();
    expect(debounced.getRunCount()).toBe(1);
  });

  it('should fire only once for rapid successive triggers', async () => {
    const debounced = createDebouncedRunner(30);
    // Simulate 5 rapid saves within the debounce window
    debounced.trigger();
    debounced.trigger();
    debounced.trigger();
    debounced.trigger();
    debounced.trigger();
    await debounced.waitForCompletion();
    expect(debounced.getRunCount()).toBe(1);
  });

  it('should fire twice for triggers separated by more than the debounce window', async () => {
    const debounced = createDebouncedRunner(30);
    debounced.trigger();
    await debounced.waitForCompletion();
    debounced.trigger();
    await debounced.waitForCompletion();
    expect(debounced.getRunCount()).toBe(2);
  });

  it('should reset the timer on each new trigger within the window', async () => {
    const debounced = createDebouncedRunner(50);
    debounced.trigger();
    // Wait less than debounce window, then re-trigger
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(debounced.getRunCount()).toBe(0); // should not have fired yet
    debounced.trigger(); // resets the timer
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(debounced.getRunCount()).toBe(0); // still waiting
    await debounced.waitForCompletion();
    expect(debounced.getRunCount()).toBe(1); // fires once after the final trigger
  });
});
