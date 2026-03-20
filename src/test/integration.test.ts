import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Cross-cutting integration tests that verify consistency across
 * multiple files in the project (messages, package.json, typings, etc.)
 */

const ROOT = path.resolve(__dirname, '..', '..');

// ── Helpers ──

function loadJson(relPath: string): any {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf-8'));
}

function loadModule(relPath: string): Record<string, string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require(path.join(ROOT, relPath));
  return mod.messages;
}

// ═══════════════════════════════════════════════════════════════════
// 1. Message key parity (en ↔ ja)
// ═══════════════════════════════════════════════════════════════════

describe('i18n - message key parity', () => {
  const en = loadModule('src/messages/en.ts');
  const ja = loadModule('src/messages/ja.ts');
  const enKeys = Object.keys(en).sort();
  const jaKeys = Object.keys(ja).sort();

  it('en.ts and ja.ts should have the same set of keys', () => {
    expect(enKeys).toEqual(jaKeys);
  });

  it('no en key should be missing from ja', () => {
    const missingInJa = enKeys.filter(k => !(k in ja));
    expect(missingInJa, `Keys in en.ts missing from ja.ts: ${missingInJa.join(', ')}`).toEqual([]);
  });

  it('no ja key should be missing from en', () => {
    const missingInEn = jaKeys.filter(k => !(k in en));
    expect(missingInEn, `Keys in ja.ts missing from en.ts: ${missingInEn.join(', ')}`).toEqual([]);
  });

  it('no message value should be empty', () => {
    const emptyEn = enKeys.filter(k => en[k].trim() === '');
    const emptyJa = jaKeys.filter(k => ja[k].trim() === '');
    expect(emptyEn, `Empty values in en.ts: ${emptyEn.join(', ')}`).toEqual([]);
    expect(emptyJa, `Empty values in ja.ts: ${emptyJa.join(', ')}`).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════
// 2. package.json commands ↔ package.nls.json consistency
// ═══════════════════════════════════════════════════════════════════

describe('package.json - command / nls consistency', () => {
  const pkg = loadJson('package.json');
  const nlsEn = loadJson('package.nls.json');
  const nlsJa = loadJson('package.nls.ja.json');
  const commands: { command: string; title: string }[] = pkg.contributes.commands;

  it('every command should have a title referencing a %key%', () => {
    for (const cmd of commands) {
      expect(cmd.title, `${cmd.command} has no %key% title`).toMatch(/^%.+%$/);
    }
  });

  it('every command title key should exist in package.nls.json', () => {
    for (const cmd of commands) {
      const key = cmd.title.replace(/%/g, '');
      expect(nlsEn, `Missing nls key for ${cmd.command}`).toHaveProperty(key);
      expect(nlsEn[key].length).toBeGreaterThan(0);
    }
  });

  it('every command title key should exist in package.nls.ja.json', () => {
    for (const cmd of commands) {
      const key = cmd.title.replace(/%/g, '');
      expect(nlsJa, `Missing ja nls key for ${cmd.command}`).toHaveProperty(key);
      expect(nlsJa[key].length).toBeGreaterThan(0);
    }
  });

  it('package.nls.json and package.nls.ja.json should have the same keys', () => {
    expect(Object.keys(nlsEn).sort()).toEqual(Object.keys(nlsJa).sort());
  });
});

// ═══════════════════════════════════════════════════════════════════
// 3. package.json - snippet registrations
// ═══════════════════════════════════════════════════════════════════

describe('package.json - snippet registrations', () => {
  const pkg = loadJson('package.json');
  const snippets: { language: string; path: string }[] = pkg.contributes.snippets;

  it('should register snippets for javascript', () => {
    const js = snippets.find(s => s.language === 'javascript');
    expect(js).toBeDefined();
    expect(fs.existsSync(path.join(ROOT, js!.path))).toBe(true);
  });

  it('should register snippets for typescript', () => {
    const ts = snippets.find(s => s.language === 'typescript');
    expect(ts).toBeDefined();
    expect(fs.existsSync(path.join(ROOT, ts!.path))).toBe(true);
  });

  it('all registered snippet files should be valid JSON', () => {
    for (const s of snippets) {
      const filePath = path.join(ROOT, s.path);
      expect(() => JSON.parse(fs.readFileSync(filePath, 'utf-8')),
        `Invalid JSON: ${s.path}`).not.toThrow();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// 4. .vscodeignore - typings not excluded
// ═══════════════════════════════════════════════════════════════════

describe('.vscodeignore - bundle inclusions', () => {
  const ignoreContent = fs.readFileSync(path.join(ROOT, '.vscodeignore'), 'utf-8');
  const lines = ignoreContent.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

  it('should not exclude typings/ directory', () => {
    const excludesTypings = lines.some(l =>
      l === 'typings/**' || l === 'typings/' || l === 'typings'
    );
    expect(excludesTypings, 'typings/ must be bundled in VSIX').toBe(false);
  });

  it('should not exclude snippets/ directory', () => {
    const excludesSnippets = lines.some(l =>
      l === 'snippets/**' || l === 'snippets/' || l === 'snippets'
    );
    expect(excludesSnippets, 'snippets/ must be bundled in VSIX').toBe(false);
  });

  it('should exclude src/ (only compiled output is needed)', () => {
    expect(lines).toContain('src/**');
  });
});

// ═══════════════════════════════════════════════════════════════════
// 5. Type definition files - expected content
// ═══════════════════════════════════════════════════════════════════

describe('Type definitions - expected files and content', () => {
  const typingsDir = path.join(ROOT, 'typings', 'rmmv');

  const expectedFiles = [
    'pixi.d.ts',
    'rpg_core.d.ts',
    'rpg_globals.d.ts',
    'rpg_managers.d.ts',
    'rpg_objects.d.ts',
    'rpg_scenes.d.ts',
    'rpg_sprites.d.ts',
    'rpg_windows.d.ts',
  ];

  it('should have all 8 expected .d.ts files', () => {
    for (const file of expectedFiles) {
      expect(fs.existsSync(path.join(typingsDir, file)), `Missing: ${file}`).toBe(true);
    }
  });

  describe('rpg_globals.d.ts', () => {
    const content = fs.readFileSync(path.join(typingsDir, 'rpg_globals.d.ts'), 'utf-8');

    it('should declare $data global variables', () => {
      expect(content).toContain('declare var $dataActors');
      expect(content).toContain('declare var $dataClasses');
      expect(content).toContain('declare var $dataSkills');
      expect(content).toContain('declare var $dataItems');
      expect(content).toContain('declare var $dataWeapons');
      expect(content).toContain('declare var $dataArmors');
      expect(content).toContain('declare var $dataEnemies');
      expect(content).toContain('declare var $dataStates');
      expect(content).toContain('declare var $dataSystem');
      expect(content).toContain('declare var $dataMap');
    });

    it('should declare $game global variables', () => {
      expect(content).toContain('declare var $gameTemp');
      expect(content).toContain('declare var $gameSystem');
      expect(content).toContain('declare var $gameScreen');
      expect(content).toContain('declare var $gameMessage');
      expect(content).toContain('declare var $gameSwitches');
      expect(content).toContain('declare var $gameVariables');
      expect(content).toContain('declare var $gameActors');
      expect(content).toContain('declare var $gameParty');
      expect(content).toContain('declare var $gameTroop');
      expect(content).toContain('declare var $gameMap');
      expect(content).toContain('declare var $gamePlayer');
    });

    it('should declare RPG data interfaces', () => {
      expect(content).toContain('interface RPG_Actor');
      expect(content).toContain('interface RPG_Skill');
      expect(content).toContain('interface RPG_Item');
      expect(content).toContain('interface RPG_Weapon');
      expect(content).toContain('interface RPG_Armor');
      expect(content).toContain('interface RPG_Enemy');
      expect(content).toContain('interface RPG_State');
      expect(content).toContain('interface RPG_System');
      expect(content).toContain('interface RPG_Map');
      expect(content).toContain('interface RPG_Event');
      expect(content).toContain('interface RPG_CommonEvent');
    });
  });

  describe('rpg_core.d.ts', () => {
    const content = fs.readFileSync(path.join(typingsDir, 'rpg_core.d.ts'), 'utf-8');

    it('should declare core classes', () => {
      expect(content).toContain('declare class Bitmap');
      expect(content).toContain('declare class Sprite');
      expect(content).toContain('declare class Window');
      expect(content).toContain('declare class Stage');
      expect(content).toContain('declare class Graphics');
      expect(content).toContain('declare class Input');
      expect(content).toContain('declare class TouchInput');
      expect(content).toContain('declare class Tilemap');
    });
  });

  describe('rpg_managers.d.ts', () => {
    const content = fs.readFileSync(path.join(typingsDir, 'rpg_managers.d.ts'), 'utf-8');

    it('should declare manager namespaces/classes', () => {
      expect(content).toContain('DataManager');
      expect(content).toContain('SceneManager');
      expect(content).toContain('BattleManager');
      expect(content).toContain('AudioManager');
      expect(content).toContain('PluginManager');
      expect(content).toContain('ImageManager');
      expect(content).toContain('ConfigManager');
    });

    it('should declare PluginManager.parameters', () => {
      expect(content).toMatch(/parameters\s*\(/);
    });

    it('should declare PluginManager.setup', () => {
      expect(content).toMatch(/setup\s*\(/);
    });
  });

  describe('rpg_objects.d.ts', () => {
    const content = fs.readFileSync(path.join(typingsDir, 'rpg_objects.d.ts'), 'utf-8');

    it('should declare key Game_* classes', () => {
      expect(content).toContain('declare class Game_Player');
      expect(content).toContain('declare class Game_Map');
      expect(content).toContain('declare class Game_Party');
      expect(content).toContain('declare class Game_Actor');
      expect(content).toContain('declare class Game_Enemy');
      expect(content).toContain('declare class Game_Event');
      expect(content).toContain('declare class Game_Interpreter');
      expect(content).toContain('declare class Game_Battler');
      expect(content).toContain('declare class Game_BattlerBase');
      expect(content).toContain('declare class Game_Action');
      expect(content).toContain('declare class Game_Switches');
      expect(content).toContain('declare class Game_Variables');
    });

    it('should declare inheritance chains', () => {
      expect(content).toMatch(/Game_Actor\s+extends\s+Game_Battler/);
      expect(content).toMatch(/Game_Enemy\s+extends\s+Game_Battler/);
      expect(content).toMatch(/Game_Battler\s+extends\s+Game_BattlerBase/);
      expect(content).toMatch(/Game_Player\s+extends\s+Game_Character/);
      expect(content).toMatch(/Game_Event\s+extends\s+Game_Character/);
      expect(content).toMatch(/Game_Party\s+extends\s+Game_Unit/);
    });
  });

  describe('rpg_scenes.d.ts', () => {
    const content = fs.readFileSync(path.join(typingsDir, 'rpg_scenes.d.ts'), 'utf-8');

    it('should declare key Scene_* classes', () => {
      expect(content).toContain('declare class Scene_Base');
      expect(content).toContain('declare class Scene_Boot');
      expect(content).toContain('declare class Scene_Title');
      expect(content).toContain('declare class Scene_Map');
      expect(content).toContain('declare class Scene_Battle');
      expect(content).toContain('declare class Scene_Menu');
      expect(content).toContain('declare class Scene_GameEnd');
    });
  });

  describe('rpg_windows.d.ts', () => {
    const content = fs.readFileSync(path.join(typingsDir, 'rpg_windows.d.ts'), 'utf-8');

    it('should declare key Window_* classes', () => {
      expect(content).toContain('declare class Window_Base');
      expect(content).toContain('declare class Window_Selectable');
      expect(content).toContain('declare class Window_Command');
      expect(content).toContain('declare class Window_Message');
      expect(content).toContain('declare class Window_BattleLog');
      expect(content).toContain('declare class Window_MenuCommand');
      expect(content).toContain('declare class Window_Options');
    });
  });

  describe('rpg_sprites.d.ts', () => {
    const content = fs.readFileSync(path.join(typingsDir, 'rpg_sprites.d.ts'), 'utf-8');

    it('should declare key Sprite_*/Spriteset_* classes', () => {
      expect(content).toContain('declare class Sprite_Character');
      expect(content).toContain('declare class Sprite_Battler');
      expect(content).toContain('declare class Sprite_Actor');
      expect(content).toContain('declare class Sprite_Enemy');
      expect(content).toContain('declare class Spriteset_Map');
      expect(content).toContain('declare class Spriteset_Battle');
    });
  });

  describe('pixi.d.ts', () => {
    const content = fs.readFileSync(path.join(typingsDir, 'pixi.d.ts'), 'utf-8');

    it('should declare PIXI namespace with core types', () => {
      expect(content).toContain('declare namespace PIXI');
      expect(content).toContain('class Container');
      expect(content).toContain('class Sprite');
      expect(content).toContain('class Graphics');
      expect(content).toContain('class Texture');
      expect(content).toContain('class Rectangle');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// 6. Quick Actions - button commands
// ═══════════════════════════════════════════════════════════════════

describe('Quick Actions - command references', () => {
  // Read the quickActions source to extract command IDs from btn() calls
  const src = fs.readFileSync(path.join(ROOT, 'src', 'sidebar', 'quickActions.ts'), 'utf-8');
  const btnCommandMatches = src.matchAll(/\bb\('(rmmv\.\w+)'/g);
  const referencedCommands = [...btnCommandMatches].map(m => m[1]);

  const pkg = loadJson('package.json');
  const registeredCommands = new Set(
    (pkg.contributes.commands as { command: string }[]).map(c => c.command)
  );

  it('should reference at least 10 commands', () => {
    expect(referencedCommands.length).toBeGreaterThanOrEqual(10);
  });

  it('every button command should be registered in package.json', () => {
    for (const cmd of referencedCommands) {
      expect(registeredCommands.has(cmd), `Button references unregistered command: ${cmd}`).toBe(true);
    }
  });

  it('should include TypeScript setup button', () => {
    expect(referencedCommands).toContain('rmmv.setupTypeScript');
  });

  it('should include TypeScript build toggle button', () => {
    expect(referencedCommands).toContain('rmmv.toggleTypeScriptBuild');
  });
});
