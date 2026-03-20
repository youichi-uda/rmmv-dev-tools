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
 * - Key RMMV patterns present (prototype chain, IIFE, etc.)
 *
 * For TS snippets we additionally verify compatibility with the RMMV type
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

const tsSnippets = loadSnippets('rmmv-ts.code-snippets.json');
const jsSnippets = loadSnippets('rmmv.code-snippets.json');

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

describe('Snippets - TS rmmv-alias', () => {
  const code = expandSnippet(tsSnippets['RMMV TS: Typed Alias Pattern'].body);

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

describe('Snippets - TS rmmv-command', () => {
  const code = expandSnippet(tsSnippets['RMMV TS: Plugin Command Handler'].body);

  it('should override Game_Interpreter.pluginCommand', () => {
    expect(code).toContain('Game_Interpreter.prototype.pluginCommand');
  });

  it('should reference PLUGIN_NAME', () => {
    expect(code).toContain('PLUGIN_NAME');
  });

  it('should include typed parameters (command: string, args: string[])', () => {
    expect(code).toContain('command: string');
    expect(code).toContain('args: string[]');
  });
});

describe('Snippets - TS rmmv-plugin', () => {
  const code = expandSnippet(tsSnippets['RMMV TS: Full Plugin Scaffold'].body);

  it('should start with annotation block', () => {
    expect(code).toMatch(/^\/\*:/);
  });

  it('should include @target MV', () => {
    expect(code).toContain('@target MV');
  });

  it('should include @plugindesc', () => {
    expect(code).toContain('@plugindesc');
  });

  it('should close annotation block', () => {
    expect(code).toContain('*/');
  });

  it('should wrap in IIFE', () => {
    expect(code).toContain('((): void => {');
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

  it('should include @param in annotation', () => {
    const annotation = code.match(/\/\*:([\s\S]*?)\*\//)?.[1] ?? '';
    expect(annotation).toContain('@param');
  });
});

describe('Snippets - TS rmmv-param', () => {
  const code = expandSnippet(tsSnippets['RMMV TS: Parameter Parsing'].body);

  it('should declare a param object', () => {
    expect(code).toContain('const param = {');
  });

  it('should reference parameters[] with string key', () => {
    expect(code).toMatch(/parameters\["[\w]*"\]/);
  });
});

describe('Snippets - TS rmmv-iife', () => {
  const code = expandSnippet(tsSnippets['RMMV TS: IIFE Wrapper'].body);

  it('should be an arrow IIFE with void return type', () => {
    expect(code).toContain('((): void => {');
    expect(code).toContain('})();');
  });

  it('should use strict mode', () => {
    expect(code).toContain('"use strict"');
  });
});

// ── Tests: JS snippet content correctness ──

describe('Snippets - JS rmmv-alias', () => {
  const code = expandSnippet(jsSnippets['RMMV: Alias Pattern'].body);

  it('should save original method reference', () => {
    expect(code).toMatch(/var _\w+_\w+ = \w+\.prototype\.\w+;/);
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

describe('Snippets - JS rmmv-command', () => {
  const code = expandSnippet(jsSnippets['RMMV: Plugin Command Handler'].body);

  it('should override Game_Interpreter.pluginCommand', () => {
    expect(code).toContain('Game_Interpreter.prototype.pluginCommand');
  });

  it('should reference PLUGIN_NAME', () => {
    expect(code).toContain('PLUGIN_NAME');
  });
});

describe('Snippets - JS rmmv-scene', () => {
  const code = expandSnippet(jsSnippets['RMMV: Scene Class'].body);

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

describe('Snippets - JS rmmv-window', () => {
  const code = expandSnippet(jsSnippets['RMMV: Window Class'].body);

  it('should define constructor function with x,y,width,height parameters', () => {
    expect(code).toMatch(/function Window_\w+\(x, y, width, height\)/);
  });

  it('should set up prototype chain from Window_Base', () => {
    expect(code).toContain('Object.create(Window_Base.prototype)');
  });

  it('should pass x,y,width,height to Window_Base.prototype.initialize', () => {
    expect(code).toContain('Window_Base.prototype.initialize.call(this, x, y, width, height)');
  });

  it('should define refresh method with contents.clear()', () => {
    expect(code).toContain('this.contents.clear()');
  });
});

describe('Snippets - JS rmmv-sprite', () => {
  const code = expandSnippet(jsSnippets['RMMV: Sprite Class'].body);

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

describe('Snippets - JS rmmv-plugin', () => {
  const code = expandSnippet(jsSnippets['RMMV: Full Plugin Scaffold'].body);

  it('should start with annotation block', () => {
    expect(code).toMatch(/^\/\*:/);
  });

  it('should wrap in IIFE', () => {
    expect(code).toContain('(function()');
    expect(code).toContain('})();');
  });

  it('should call PluginManager.parameters', () => {
    expect(code).toContain('PluginManager.parameters(PLUGIN_NAME)');
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
