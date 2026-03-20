# Gumroad Listing — RMMV Dev Tools Pro

## Product Name

RMMV Dev Tools Pro

## Price

$12+ (Pay what you want, $12 minimum)

## URL

https://y1uda.gumroad.com/l/rmmv?wanted=true

## Summary (short description)

Pro upgrade for RMMV Dev Tools — the VS Code extension for RPG Maker MV plugin development. Includes a custom debugger built for MV's NW.js (Chrome 65), TypeScript support, live game preview, scene reload, and more.

## Description (product page body — plain text for Gumroad rich text editor)

RMMV Dev Tools Pro

Unlock the full power of RMMV Dev Tools — the VS Code extension purpose-built for RPG Maker MV plugin development.

The free version includes 14 features: annotation highlighting, validation, IntelliSense, conflict detection, asset checking, database browser, and more. Pro adds another 17 features for serious plugin development.


★ CUSTOM DEBUGGER FOR MV (the big one)

VS Code's built-in JavaScript debugger doesn't work with MV's NW.js (Chrome 65) — it relies on Target.attachToBrowserTarget which doesn't exist on this version of Chromium. We built a custom Debug Adapter that connects directly via CDP.

- F5 to launch your game and attach the debugger automatically
- Breakpoints in .js files — click the gutter, hit the line
- Step Over / Step Into / Step Out
- Variables panel — inspect and modify values mid-execution
- Debug Console — evaluate expressions like $gameParty.gold() while paused
- TypeScript source maps — set breakpoints directly in .ts files
- chrome-extension:// URL mapping handled automatically


★ TYPESCRIPT WORKFLOW (3 features)

TypeScript Setup
One-click setup: generates tsconfig.json, ts/plugins/ directory, and copies RMMV type definitions. Full IntelliSense for $gameParty, Window_Base, Scene_Map, Game_Interpreter, and every RMMV class.

TypeScript Auto-Build
File watcher compiles ts/plugins/*.ts to js/plugins/*.js on save. Status bar shows build state. Errors appear in the Problems panel with clickable file:line links.

TypeScript Templates & Snippets
Plugin template wizard now offers JavaScript or TypeScript output. TS-specific code snippets: rmmv-alias, rmmv-command, rmmv-plugin, rmmv-param, rmmv-iife.


TESTPLAY & DEBUGGING (4 more features)

Quick Scene Reload
Save your plugin file during testplay and the current scene reloads with fresh code — no restart from the title screen.

Live Game Preview
Webview panel showing a live screenshot of the running game, updated in real-time. See your changes without switching windows.

Testplay Console
Captures console.log/warn/error from the running game into a VS Code output channel. Timestamped, with error tracking and reconnection handling.

Game State Inspector
Sidebar panel showing live game state — current map, player position, party members, gold, playtime, switches, and variables. Auto-refresh toggle for continuous monitoring.


CODE ANALYSIS & REFACTORING (4 features)

Annotation Preview
Live webview showing exactly how your plugin will appear in RPG Maker's Plugin Manager. Updates as you type.

Plugin Dependency Graph
Interactive webview visualizing plugin relationships. Detects circular dependencies and ordering violations at a glance.

Parameter Rename
Rename @param tags with full refactoring — automatically updates @parent references and parameters["name"] usage across your code.

Multi-Language Sync
Structural consistency checker for locale blocks (/*:, /*:ja, etc.). Detects missing parameters and structural mismatches across languages with CodeLens warnings.


DATA & PROJECT MANAGEMENT (5 features)

Data Hover Preview
Hover $dataActors[3] in your code and see the actor's name and stats inline. Hover $gameVariables.value(5) to see the variable name from System.json.

Formula Evaluator
Hover over damage/healing formula fields to see evaluated results inline. Understand complex formulas without running the game.

Visual Note Tag Editor
Webview for visually editing note tags in actors, classes, items, and enemies. WYSIWYG editing of structured note tag data.

Class Hierarchy Browser
Sidebar tree view of RMMV's class inheritance — Scenes, Windows, Sprites, Game objects. Search and navigate to method definitions with one click.

Plugin Registry Integration
Check for plugin updates and view compatibility info. Plugin metadata lookup from the registry.


HOW IT WORKS

1. Install RMMV Dev Tools from the VS Code Marketplace (free)
2. Purchase this Pro license
3. Activate with Command Palette: RMMV: Activate Pro License
4. All Pro features are unlocked immediately

One-time purchase. No subscription. Works offline after activation.


FREE VERSION (14 features)

- Annotation syntax highlighting
- Smart tag completion (context-aware)
- @type value completion (24+ types)
- Real-time annotation validation
- Annotation formatter
- Hover documentation
- Inline color picker for hex colors
- Plugin conflict detection with CodeLens
- Asset reference checker
- IntelliSense one-click setup
- Plugin template generator
- Quick actions panel
- Database browser sidebar
- Note tag index sidebar


REQUIREMENTS

- VS Code 1.75.0+
- RMMV Dev Tools extension (free, from VS Code Marketplace)
- An RPG Maker MV project


SUPPORT

Discord: https://discord.gg/CDFmWGkfDC

---

## Tags

rpg maker, rpg maker mv, rmmv, vscode, plugin development, game development, javascript, typescript, debugger

## Cover Image Alt Text

RMMV Dev Tools Pro — VS Code extension for RPG Maker MV plugin development with built-in debugger

## Content Delivery

Digital product — license key delivered after purchase.
Buyer receives a Gumroad license key to activate within VS Code.

## Thumbnail / Cover Image Notes

- Show VS Code with debugger paused at a breakpoint + Variables panel + game running
- Dark theme, blue accent (#1a3a6e)
- Include text: "RMMV Dev Tools Pro" and "14 Free + 17 Pro Features"
- Badge: "Custom Debugger for MV"
