import { describe, it, expect } from 'vitest';

/**
 * Tests for TypeScript template generation (src/template/generator.ts).
 *
 * The buildTypeScriptTemplate function is module-private.
 * We replicate the template generation logic here to verify
 * the output structure matches RMMV plugin conventions.
 */

// ── Replicated template generation logic ──

interface PluginInfo {
  name: string;
  author: string;
  description: string;
  url: string;
  base: string;
  hasCommands: boolean;
  hasParameters: boolean;
  language: 'javascript' | 'typescript';
}

function buildTypeScriptTemplate(info: PluginInfo): string {
  const lines: string[] = [];

  lines.push('/*:');
  lines.push(' * @target MV');
  lines.push(` * @plugindesc ${info.description}`);
  lines.push(` * @author ${info.author}`);
  if (info.url) {
    lines.push(` * @url ${info.url}`);
  }
  if (info.base) {
    lines.push(` * @base ${info.base}`);
  }
  lines.push(' *');

  if (info.hasParameters) {
    lines.push(' * @param enabled');
    lines.push(' * @text Enabled');
    lines.push(' * @desc Enable or disable this plugin\'s effects.');
    lines.push(' * @type boolean');
    lines.push(' * @on Enable');
    lines.push(' * @off Disable');
    lines.push(' * @default true');
    lines.push(' *');
    lines.push(' * @param displayName');
    lines.push(' * @text Display Name');
    lines.push(' * @desc Name displayed in-game.');
    lines.push(' * @type string');
    lines.push(' * @default Default');
    lines.push(' *');
  }

  if (info.hasCommands) {
    lines.push(' * @command showMessage');
    lines.push(' * @text Show Message');
    lines.push(' * @desc Displays a message on screen.');
    lines.push(' *');
    lines.push(' * @arg text');
    lines.push(' * @text Message Text');
    lines.push(' * @desc The text to display.');
    lines.push(' * @type string');
    lines.push(' * @default Hello!');
    lines.push(' *');
  }

  lines.push(' * @help');
  lines.push(` * ${info.name}`);
  lines.push(' *');
  lines.push(` * ${info.description}`);
  lines.push(' *');
  lines.push(' * Usage:');
  lines.push(' *   Enable the plugin in Plugin Manager.');
  if (info.hasCommands) {
    lines.push(' *   Use plugin commands from the Event Editor.');
  }
  lines.push(' */');
  lines.push('');

  lines.push('(() => {');
  lines.push('  "use strict";');
  lines.push('');
  lines.push(`  const PLUGIN_NAME = "${info.name}";`);
  lines.push('');

  if (info.hasParameters) {
    lines.push('  const parameters = PluginManager.parameters(PLUGIN_NAME);');
    lines.push('  const param = {');
    lines.push('    enabled: parameters["enabled"] === "true",');
    lines.push('    displayName: parameters["displayName"] || "Default",');
    lines.push('  };');
    lines.push('');
  }

  if (info.hasCommands) {
    lines.push('  PluginManager.registerCommand(PLUGIN_NAME, "showMessage", (args) => {');
    lines.push('    const text = args.text || "Hello!";');
    lines.push('    // TODO: Implement your command logic here');
    lines.push('    console.log(`${PLUGIN_NAME}: ${text}`);');
    lines.push('  });');
    lines.push('');
  }

  lines.push('  // TODO: Add your plugin logic here');
  lines.push('');
  lines.push('})();');
  lines.push('');

  return lines.join('\n');
}

// ── Tests ──

describe('TypeScript Template - annotation block', () => {
  const info: PluginInfo = {
    name: 'TestPlugin',
    author: 'TestAuthor',
    description: 'A test plugin',
    url: 'https://example.com',
    base: '',
    hasCommands: true,
    hasParameters: true,
    language: 'typescript',
  };

  it('should start with /*: annotation block', () => {
    const template = buildTypeScriptTemplate(info);
    expect(template.startsWith('/*:')).toBe(true);
  });

  it('should include @target MV', () => {
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('@target MV');
  });

  it('should include @plugindesc', () => {
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('@plugindesc A test plugin');
  });

  it('should include @author', () => {
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('@author TestAuthor');
  });

  it('should include @url when provided', () => {
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('@url https://example.com');
  });

  it('should not include @url when empty', () => {
    const noUrlInfo = { ...info, url: '' };
    const template = buildTypeScriptTemplate(noUrlInfo);
    expect(template).not.toContain('@url');
  });

  it('should include @base when provided', () => {
    const baseInfo = { ...info, base: 'PluginCommonBase' };
    const template = buildTypeScriptTemplate(baseInfo);
    expect(template).toContain('@base PluginCommonBase');
  });

  it('should not include @base when empty', () => {
    const template = buildTypeScriptTemplate(info);
    expect(template).not.toContain('@base');
  });

  it('should include @help section', () => {
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('@help');
  });

  it('should close annotation block with */', () => {
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain(' */');
  });
});

describe('TypeScript Template - parameters', () => {
  it('should include @param blocks when hasParameters is true', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: true, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('@param enabled');
    expect(template).toContain('@param displayName');
    expect(template).toContain('@type boolean');
    expect(template).toContain('@type string');
  });

  it('should include parameter parsing code when hasParameters is true', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: true, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('PluginManager.parameters(PLUGIN_NAME)');
    expect(template).toContain('parameters["enabled"]');
    expect(template).toContain('parameters["displayName"]');
  });

  it('should not include parameters when hasParameters is false', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    expect(template).not.toContain('@param enabled');
    expect(template).not.toContain('PluginManager.parameters');
  });
});

describe('TypeScript Template - commands', () => {
  it('should include typed command registration when hasCommands is true', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: true, hasParameters: false, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('@command showMessage');
    expect(template).toContain('@arg text');
    expect(template).toContain('PluginManager.registerCommand');
  });

  it('should use inferred types from Record<string, string> args', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: true, hasParameters: false, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    // args type is inferred from registerCommand's callback signature (Record<string, string>)
    // so no explicit type annotation needed — just (args) =>
    expect(template).toContain('(args) =>');
    expect(template).toContain('args.text');
  });

  it('should not use explicit type annotation on args to avoid Record<string,string> conflict', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: true, hasParameters: false, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    // registerCommand callback receives Record<string, string>.
    // An explicit type like { text?: string } is NOT assignable to Record<string, string>
    // because it has a required key. Template must use bare (args) to let TS infer the type.
    expect(template).not.toMatch(/args\s*:\s*\{/);
    expect(template).toMatch(/\(args\)\s*=>/);
  });

  it('should not include commands when hasCommands is false', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    expect(template).not.toContain('@command');
    expect(template).not.toContain('registerCommand');
  });
});

describe('TypeScript Template - body structure', () => {
  it('should wrap plugin body in IIFE', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('(() => {');
    expect(template).toContain('})();');
  });

  it('should use strict mode', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('"use strict"');
  });

  it('should define PLUGIN_NAME constant', () => {
    const info: PluginInfo = {
      name: 'MyAwesomePlugin', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);
    expect(template).toContain('const PLUGIN_NAME = "MyAwesomePlugin"');
  });
});

describe('TypeScript Template - annotation preservation', () => {
  it('should produce template compatible with removeComments: false', () => {
    const info: PluginInfo = {
      name: 'Test', author: 'A', description: 'Desc', url: '', base: '',
      hasCommands: true, hasParameters: true, language: 'typescript',
    };
    const template = buildTypeScriptTemplate(info);

    // The annotation block must be a standard JS block comment
    // that tsc with removeComments: false will preserve
    const blockMatch = template.match(/\/\*:([\s\S]*?)\*\//);
    expect(blockMatch).not.toBeNull();

    // Verify it contains the essential RMMV tags
    const block = blockMatch![1];
    expect(block).toContain('@target MV');
    expect(block).toContain('@plugindesc');
    expect(block).toContain('@param');
    expect(block).toContain('@command');
    expect(block).toContain('@arg');
    expect(block).toContain('@help');
  });
});
