import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Tests that snippet bodies produce syntactically valid code.
 *
 * VS Code snippets use placeholders like ${1:Class}. We expand them to their
 * default values and verify the resulting code is structurally sound:
 * - Balanced braces / parentheses
 * - No stray snippet syntax in output
 * - Key RMMZ patterns present (prototype chain, IIFE, etc.)
 *
 * For TS snippets we additionally verify compatibility with the RMMZ type
 * definitions (e.g. registerCommand callback must not use explicit arg types).
 */

// ── Helpers ──

/** Expand VS Code snippet placeholders to their default text. */
function expandSnippet(body: string[]): string {
  let code = body.join('\n');
  // Replace tabstops: ${N:default} → default, ${N} → '', $0 → ''
  // Handle nested: ${1:${TM_FILENAME_BASE}} → TM_FILENAME_BASE (treat as literal)
  code = code.replace(/\$\{\d+:\$\{(\w+)\}\}/g, '$1');
  code = code.replace(/\$\{\d+:([^}]*)}/g, '$1');
  code = code.replace(/\$\{\d+\}/g, '');
  code = code.replace(/\$0/g, '');
  return code;
}

function countChar(s: string, ch: string): number {
  let n = 0;
  for (const c of s) if (c === ch) n++;
  return n;
}

function loadSnippets(filename: string): Record<string, { prefix: string; scope: string; body: string[] }> {
  const filePath = path.join(__dirname, '..', '..', 'snippets', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// ── Load snippet files ──

const tsSnippets = loadSnippets('rmmz-ts.code-snippets.json');
const jsSnippets = loadSnippets('rmmz.code-snippets.json');

// ── Tests: structural validity (both JS and TS) ──

describe('Snippets - structural validity', () => {
  const allSnippets = [
    ...Object.entries(tsSnippets).map(([name, s]) => ({ name, ...s, file: 'TS' })),
    ...Object.entries(jsSnippets).map(([name, s]) => ({ name, ...s, file: 'JS' })),
  ];

  for (const snippet of allSnippets) {
    describe(`${snippet.file}: ${snippet.name} (${snippet.prefix})`, () => {
      const code = expandSnippet(snippet.body);

      it('should have balanced braces', () => {
        expect(countChar(code, '{')).toBe(countChar(code, '}'));
      });

      it('should have balanced parentheses', () => {
        expect(countChar(code, '(')).toBe(countChar(code, ')'));
      });

      it('should have balanced square brackets', () => {
        expect(countChar(code, '[')).toBe(countChar(code, ']'));
      });

      it('should not contain unexpanded snippet syntax', () => {
        // After expansion there should be no ${...} or $0 left
        expect(code).not.toMatch(/\$\{\d+/);
        expect(code).not.toContain('$0');
      });
    });
  }
});

// ── Tests: TS snippet content correctness ──

describe('Snippets - TS rmmz-alias', () => {
  const code = expandSnippet(tsSnippets['RMMZ TS: Typed Alias Pattern'].body);

  it('should save original method reference', () => {
    expect(code).toMatch(/const _\w+_\w+ = \w+\.prototype\.\w+;/);
  });

  it('should assign new function to prototype', () => {
    expect(code).toMatch(/\w+\.prototype\.\w+ = function\(/);
  });

  it('should include this: type annotation', () => {
    expect(code).toContain('this: ');
  });

  it('should call original method with .call(this)', () => {
    expect(code).toContain('.call(this');
  });
});

describe('Snippets - TS rmmz-command', () => {
  const code = expandSnippet(tsSnippets['RMMZ TS: Register Plugin Command'].body);

  it('should call PluginManager.registerCommand', () => {
    expect(code).toContain('PluginManager.registerCommand(');
  });

  it('should reference PLUGIN_NAME', () => {
    expect(code).toContain('PLUGIN_NAME');
  });

  it('should use bare (args) without explicit type annotation', () => {
    // Explicit arg types conflict with Record<string, string> callback signature
    expect(code).toMatch(/\(args\)\s*=>/);
    expect(code).not.toMatch(/args\s*:\s*\{/);
  });
});

describe('Snippets - TS rmmz-plugin', () => {
  const code = expandSnippet(tsSnippets['RMMZ TS: Full Plugin Scaffold'].body);

  it('should start with annotation block', () => {
    expect(code).toMatch(/^\/\*:/);
  });

  it('should include @target MZ', () => {
    expect(code).toContain('@target MZ');
  });

  it('should include @plugindesc', () => {
    expect(code).toContain('@plugindesc');
  });

  it('should close annotation block', () => {
    expect(code).toContain('*/');
  });

  it('should wrap in IIFE', () => {
    expect(code).toContain('(() => {');
    expect(code).toContain('})();');
  });

  it('should use strict mode', () => {
    expect(code).toContain('"use strict"');
  });

  it('should define PLUGIN_NAME', () => {
    expect(code).toContain('const PLUGIN_NAME');
  });

  it('should call PluginManager.parameters', () => {
    expect(code).toContain('PluginManager.parameters(PLUGIN_NAME)');
  });

  it('should call PluginManager.registerCommand with bare (args)', () => {
    expect(code).toContain('PluginManager.registerCommand(');
    expect(code).toMatch(/\(args\)\s*=>/);
    expect(code).not.toMatch(/args\s*:\s*\{/);
  });

  it('should include @param, @command, @arg in annotation', () => {
    const annotation = code.match(/\/\*:([\s\S]*?)\*\//)?.[1] ?? '';
    expect(annotation).toContain('@param');
    expect(annotation).toContain('@command');
    expect(annotation).toContain('@arg');
  });
});

describe('Snippets - TS rmmz-param', () => {
  const code = expandSnippet(tsSnippets['RMMZ TS: Parameter Parsing'].body);

  it('should declare a param object', () => {
    expect(code).toContain('const param = {');
  });

  it('should reference parameters[] with string key', () => {
    expect(code).toMatch(/parameters\["[\w]*"\]/);
  });
});

describe('Snippets - TS rmmz-iife', () => {
  const code = expandSnippet(tsSnippets['RMMZ TS: IIFE Wrapper'].body);

  it('should be an arrow IIFE', () => {
    expect(code).toContain('(() => {');
    expect(code).toContain('})();');
  });

  it('should use strict mode', () => {
    expect(code).toContain('"use strict"');
  });
});

// ── Tests: JS snippet content correctness ──

describe('Snippets - JS rmmz-alias', () => {
  const code = expandSnippet(jsSnippets['RMMZ: Alias Pattern'].body);

  it('should save original method reference', () => {
    expect(code).toMatch(/const _\w+_\w+ = \w+\.prototype\.\w+;/);
  });

  it('should assign new function to prototype', () => {
    expect(code).toMatch(/\w+\.prototype\.\w+ = function\(/);
  });

  it('should NOT include this: type annotation (JS)', () => {
    expect(code).not.toContain('this: ');
  });

  it('should call original method with .call(this)', () => {
    expect(code).toContain('.call(this');
  });
});

describe('Snippets - JS rmmz-command', () => {
  const code = expandSnippet(jsSnippets['RMMZ: Register Plugin Command'].body);

  it('should call PluginManager.registerCommand', () => {
    expect(code).toContain('PluginManager.registerCommand(');
  });

  it('should use bare (args) callback', () => {
    expect(code).toMatch(/\(args\)\s*=>/);
  });
});

describe('Snippets - JS rmmz-scene', () => {
  const code = expandSnippet(jsSnippets['RMMZ: Scene Class'].body);

  it('should define constructor function', () => {
    expect(code).toMatch(/function Scene_\w+\(\)/);
  });

  it('should set up prototype chain from Scene_Base', () => {
    expect(code).toContain('Object.create(Scene_Base.prototype)');
  });

  it('should set constructor property', () => {
    expect(code).toMatch(/\.constructor = Scene_\w+;/);
  });

  it('should define initialize calling Scene_Base.prototype.initialize', () => {
    expect(code).toContain('Scene_Base.prototype.initialize.call(this)');
  });

  it('should define create, start, and update methods', () => {
    expect(code).toContain('.prototype.create = function()');
    expect(code).toContain('.prototype.start = function()');
    expect(code).toContain('.prototype.update = function()');
  });
});

describe('Snippets - JS rmmz-window', () => {
  const code = expandSnippet(jsSnippets['RMMZ: Window Class'].body);

  it('should define constructor function with rect parameter', () => {
    expect(code).toMatch(/function Window_\w+\(rect\)/);
  });

  it('should set up prototype chain from Window_Base', () => {
    expect(code).toContain('Object.create(Window_Base.prototype)');
  });

  it('should pass rect to Window_Base.prototype.initialize', () => {
    expect(code).toContain('Window_Base.prototype.initialize.call(this, rect)');
  });

  it('should define refresh method with contents.clear()', () => {
    expect(code).toContain('this.contents.clear()');
  });
});

describe('Snippets - JS rmmz-sprite', () => {
  const code = expandSnippet(jsSnippets['RMMZ: Sprite Class'].body);

  it('should define constructor function', () => {
    expect(code).toMatch(/function Sprite_\w+\(\)/);
  });

  it('should set up prototype chain from Sprite', () => {
    expect(code).toContain('Object.create(Sprite.prototype)');
  });

  it('should define destroy method forwarding options', () => {
    expect(code).toContain('.prototype.destroy = function(options)');
    expect(code).toContain('Sprite.prototype.destroy.call(this, options)');
  });
});

describe('Snippets - JS rmmz-plugin', () => {
  const code = expandSnippet(jsSnippets['RMMZ: Full Plugin Scaffold'].body);

  it('should start with annotation block', () => {
    expect(code).toMatch(/^\/\*:/);
  });

  it('should wrap in IIFE', () => {
    expect(code).toContain('(() => {');
    expect(code).toContain('})();');
  });

  it('should use PluginManager.registerCommand with bare (args)', () => {
    expect(code).toMatch(/\(args\)\s*=>/);
  });
});

// ── Tests: scope isolation ──

describe('Snippets - scope isolation', () => {
  it('all TS snippets should have scope "typescript"', () => {
    for (const [name, snippet] of Object.entries(tsSnippets)) {
      expect(snippet.scope, `${name} has wrong scope`).toBe('typescript');
    }
  });

  it('all JS snippets should have scope "javascript"', () => {
    for (const [name, snippet] of Object.entries(jsSnippets)) {
      expect(snippet.scope, `${name} has wrong scope`).toBe('javascript');
    }
  });

  it('TS and JS should have no overlapping prefixes in the same scope', () => {
    const tsPrefixes = new Set(Object.values(tsSnippets).map(s => s.prefix));
    const jsPrefixes = new Set(Object.values(jsSnippets).map(s => s.prefix));
    // Same prefix is fine because they're in different scopes.
    // But verify they ARE in different scopes.
    for (const ts of Object.values(tsSnippets)) {
      for (const js of Object.values(jsSnippets)) {
        if (ts.prefix === js.prefix) {
          expect(ts.scope).not.toBe(js.scope);
        }
      }
    }
  });
});
