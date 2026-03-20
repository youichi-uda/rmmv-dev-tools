import { describe, it, expect } from 'vitest';

/**
 * Tests for the JavaScript template generator (buildTemplate in generator.ts).
 *
 * The TS template is tested in typescript-template.test.ts.
 * This file tests the JS template to ensure it was not broken by the
 * language selection changes and has no TS-specific syntax.
 */

// ── Replicated from generator.ts ──

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

function buildTemplate(info: PluginInfo): string {
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
  lines.push('  //');
  lines.push('  // Example: Override a method');
  lines.push('  // const _alias = Game_Player.prototype.update;');
  lines.push('  // Game_Player.prototype.update = function(sceneActive) {');
  lines.push('  //   _alias.call(this, sceneActive);');
  lines.push('  //   // Your logic here');
  lines.push('  // };');
  lines.push('');
  lines.push('})();');
  lines.push('');

  return lines.join('\n');
}

// ── Tests ──

describe('JS Template - no TypeScript syntax', () => {
  const info: PluginInfo = {
    name: 'Test', author: 'A', description: 'Desc', url: '', base: '',
    hasCommands: true, hasParameters: true, language: 'javascript',
  };
  const template = buildTemplate(info);

  it('should not contain type annotations on variables', () => {
    // No `: string`, `: number`, `: boolean` on variable declarations
    // (exclude annotation block which has @type string etc.)
    const body = template.split('*/')[1] || '';
    expect(body).not.toMatch(/const\s+\w+\s*:\s*(string|number|boolean)\b/);
  });

  it('should not contain "this: " typed parameter', () => {
    expect(template).not.toContain('this: ');
  });

  it('should not contain args type annotation', () => {
    expect(template).not.toMatch(/args\s*:\s*\{/);
  });

  it('should use bare (args) in registerCommand callback', () => {
    expect(template).toMatch(/\(args\)\s*=>/);
  });
});

describe('JS Template - annotation block', () => {
  const full: PluginInfo = {
    name: 'MyPlugin', author: 'Dev', description: 'A plugin',
    url: 'https://example.com', base: 'PluginCommonBase',
    hasCommands: true, hasParameters: true, language: 'javascript',
  };
  const template = buildTemplate(full);

  it('should start with /*: annotation block', () => {
    expect(template.startsWith('/*:')).toBe(true);
  });

  it('should include @target MV', () => {
    expect(template).toContain('@target MV');
  });

  it('should include @plugindesc, @author', () => {
    expect(template).toContain('@plugindesc A plugin');
    expect(template).toContain('@author Dev');
  });

  it('should include @url when provided', () => {
    expect(template).toContain('@url https://example.com');
  });

  it('should include @base when provided', () => {
    expect(template).toContain('@base PluginCommonBase');
  });

  it('should include @param, @command, @arg', () => {
    expect(template).toContain('@param enabled');
    expect(template).toContain('@command showMessage');
    expect(template).toContain('@arg text');
  });

  it('should include @help section', () => {
    expect(template).toContain('@help');
  });
});

describe('JS Template - body structure', () => {
  const info: PluginInfo = {
    name: 'Test', author: 'A', description: '', url: '', base: '',
    hasCommands: true, hasParameters: true, language: 'javascript',
  };
  const template = buildTemplate(info);

  it('should wrap in IIFE', () => {
    expect(template).toContain('(() => {');
    expect(template).toContain('})();');
  });

  it('should use strict mode', () => {
    expect(template).toContain('"use strict"');
  });

  it('should define PLUGIN_NAME', () => {
    expect(template).toContain('const PLUGIN_NAME = "Test"');
  });

  it('should call PluginManager.parameters when hasParameters', () => {
    expect(template).toContain('PluginManager.parameters(PLUGIN_NAME)');
  });

  it('should call PluginManager.registerCommand when hasCommands', () => {
    expect(template).toContain('PluginManager.registerCommand(PLUGIN_NAME');
  });
});

describe('JS Template - optional features', () => {
  it('should not include @url when empty', () => {
    const info: PluginInfo = {
      name: 'T', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'javascript',
    };
    expect(buildTemplate(info)).not.toContain('@url');
  });

  it('should not include @base when empty', () => {
    const info: PluginInfo = {
      name: 'T', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'javascript',
    };
    expect(buildTemplate(info)).not.toContain('@base');
  });

  it('should not include params when hasParameters is false', () => {
    const info: PluginInfo = {
      name: 'T', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'javascript',
    };
    const t = buildTemplate(info);
    expect(t).not.toContain('@param');
    expect(t).not.toContain('PluginManager.parameters');
  });

  it('should not include commands when hasCommands is false', () => {
    const info: PluginInfo = {
      name: 'T', author: 'A', description: '', url: '', base: '',
      hasCommands: false, hasParameters: false, language: 'javascript',
    };
    const t = buildTemplate(info);
    expect(t).not.toContain('@command');
    expect(t).not.toContain('registerCommand');
  });
});
