# Changelog

## [1.1.6] - 2026-03-27

### Fixed

- Revert `RMMV_StorageManager` → `StorageManager` to match runtime name and prevent `ReferenceError`
- Remove `"DOM"` from generated tsconfig `lib` to avoid irreconcilable name conflicts with DOM globals
- Add `dom-rmmv.d.ts` providing essential DOM type declarations without conflicting `Window`/`StorageManager` globals

## [1.1.5] - 2026-03-26

### Fixed

- Comprehensive type fixes, conflict report ordering, auto-build persistence

## [1.1.4] - 2026-03-25

### Fixed

- Fix `Game_Action.itemTargetCandidates` return type to `(Game_Actor | Game_Enemy)[]`
- Add `Sprite.dy` and `Sprite.ry` properties used by `Sprite_Damage`
- Fix `Window.initialize` signature to allow `Window_Base` override
- Add `id` property to `RPG_MapInfo` type definition
- Add index signature to `Game_BattlerBase` and `TextManager` for dynamic access

### Changed

- Remove internal docs from repository

## [1.1.3] - 2026-03-24

### Fixed

- Add missing `@type` values: `icon`, `color` (MV 1.5.0+)
- Support multi-dimensional array types like `number[][]`

## [0.1.0] - 2026-03-17

### Added

- Annotation syntax highlighting for `/*:`, `/*:ja`, and `/*~struct~` blocks
- Context-aware `@tag` completion (scope-sensitive: top-level, @param, @command, @arg, struct)
- `@type` value completion with descriptions (22+ types including database and struct)
- Real-time annotation validation (unknown tags, invalid types, scope violations, type mismatches)
- Hover documentation for all annotation tags and type values
- IntelliSense one-click setup (`jsconfig.json` generation with MZ project detection)
- Debugger one-click setup (`launch.json` for NW.js, auto-repair of `package.json` chromium-args)
- Plugin template generator with interactive prompts
