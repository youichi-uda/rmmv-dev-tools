# RMMV Dev Tools — MV 版移植計画書

## 概要

RMMZ Dev Tools v1.1.0 をフォークし、RPG Maker MV 専用の VS Code 拡張機能として再構成する。
MZ 版と同等の開発体験を MV プラグイン開発者に提供する。

## 製品情報

| 項目 | 値 |
|------|-----|
| 製品名 | RMMV Dev Tools |
| パッケージ名 | `rmmv-dev-tools` |
| Publisher | `abyo-software` |
| 初版バージョン | `1.0.0` |
| 価格 | $12 買い切り（MZ 版と同額） |
| フォーク元 | rmmz-dev-tools v1.1.0 (commit c3ccf7d) |

## MV と MZ の主な技術的差異

| 項目 | MV | MZ |
|------|-----|-----|
| コアスクリプト | `rpg_core.js`, `rpg_managers.js`, `rpg_objects.js`, `rpg_scenes.js`, `rpg_sprites.js`, `rpg_windows.js` | `rmmz_core.js`, `rmmz_managers.js`, `rmmz_objects.js`, `rmmz_scenes.js`, `rmmz_sprites.js`, `rmmz_windows.js` |
| PIXI.js | v4 | v5 |
| プラグインコマンド | `Game_Interpreter.prototype.pluginCommand` で文字列パース | `PluginManager.registerCommand` で構造化登録 |
| アノテーション | `/*: */` （`@command`, `@arg` なし） | `/*: */` （`@command`, `@arg`, `@base`, `@orderAfter`, `@orderBefore` あり） |
| NW.js | 古いバージョン（Chromium 50-60 台） | 新しいバージョン（Chromium 90+） |
| ウィンドウ基底 | `Window_Base` に `drawActorHp` 等の便利メソッドが多数 | `Window_Base` はスリム化、`Window_StatusBase` に分離 |
| 戦闘システム | ターン制のみ | ターン制 + TPB |
| `Window_Scrollable` | 存在しない | `Window_Base` と `Window_Selectable` の間に存在 |
| `ColorFilter` | 存在しない | スプライトの色調変更用 |
| `Scene_Message` | 存在しない | `Scene_Map` と `Scene_Battle` の共通基底 |

## 移植作業の分類

### そのまま使える（変更不要）

- `src/conflict/detector.ts` — prototype 上書き検出（JS 汎用）
- `src/conflict/codeLens.ts` — CodeLens 表示
- `src/database/browser.ts` — `data/*.json` ツリー表示
- `src/notetag/provider.ts` — ノートタグスキャン
- `src/notetag/editor.ts` — ノートタグエディター
- `src/annotation/colorProvider.ts` — カラーピッカー
- `src/annotation/formatter.ts` — アノテーション整形
- `src/annotation/hoverProvider.ts` — ホバードキュメント
- `src/intellisense/setup.ts` — `jsconfig.json` 生成
- `src/sidebar/quickActions.ts` — サイドバーパネル（コマンド参照の修正のみ）
- `src/license/gumroad.ts` — ライセンス基盤
- `src/i18n.ts` — i18n 基盤
- `src/reload/sceneReload.ts` — CDP 経由のシーンリロード
- `src/testplay/console.ts` — コンソールキャプチャ
- `src/testplay/livePreview.ts` — ライブプレビュー
- `src/testplay/stateInspector.ts` — ゲーム状態表示

### 修正が必要

| ファイル | 修正内容 | 工数 |
|---------|---------|------|
| `package.json` | 名前・説明・キーワードを MV 用に変更 | 小 |
| `package.nls.json` / `package.nls.ja.json` | コマンド名を MV 用に変更 | 小 |
| `README.md` / `README.ja.md` | MV 用に書き換え | 中 |
| `src/extension.ts` | `rmmz.` → `rmmv.` コマンドID リネーム | 小 |
| `src/messages/en.ts` / `ja.ts` | `rmmz` → `rmmv` 置換 + MV 固有メッセージ | 小 |
| `src/annotation/completionProvider.ts` | `@command`, `@arg`, `@base`, `@orderAfter`, `@orderBefore` を除外 | 小 |
| `src/annotation/tags.ts` | MV で無効なタグを除去 | 小 |
| `src/annotation/validator.ts` | `@command`/`@arg` スコープ検証を除去 | 小 |
| `src/annotation/langSync.ts` | `@command`/`@arg` 同期チェックを除去 | 小 |
| `src/annotation/renameProvider.ts` | `@arg` リネームを除去 | 小 |
| `src/preview/annotationPreview.ts` | コマンドセクションのプレビューを除去 | 小 |
| `src/template/generator.ts` | MV 用テンプレート（`pluginCommand` パターン） | 中 |
| `src/debugger/setup.ts` | NW.js パス探索を MV に合わせる（`nwjs-win` → MV のパス構造） | 小 |
| `src/dependency/graph.ts` | `@base`/`@orderAfter`/`@orderBefore` なしに対応（ロード順のみ） | 小 |
| `src/datalink/hover.ts` | MV のデータ構造差異に対応 | 小 |
| `src/hierarchy/browser.ts` | MV のクラス階層に合わせる | 中 |
| `snippets/rmmz.code-snippets.json` | MV 用スニペット（`pluginCommand` パターン） | 中 |
| `snippets/rmmz-ts.code-snippets.json` | MV 用 TS スニペット | 中 |
| `syntaxes/rmmz-annotation.tmLanguage.json` | `@command`/`@arg` ハイライト除去 | 小 |

### 作り直しが必要

| ファイル | 内容 | 工数 |
|---------|------|------|
| `typings/rmmv/rpg_core.d.ts` | MV コアクラスの型定義 | 大 |
| `typings/rmmv/rpg_managers.d.ts` | MV マネージャの型定義 | 大 |
| `typings/rmmv/rpg_objects.d.ts` | MV Game_* クラスの型定義 | 大 |
| `typings/rmmv/rpg_scenes.d.ts` | MV Scene_* クラスの型定義 | 大 |
| `typings/rmmv/rpg_sprites.d.ts` | MV Sprite_* クラスの型定義 | 大 |
| `typings/rmmv/rpg_windows.d.ts` | MV Window_* クラスの型定義 | 大 |
| `typings/rmmv/rpg_globals.d.ts` | MV グローバル変数・RPG データ型 | 大 |
| `typings/rmmv/pixi-v4.d.ts` | PIXI.js v4 スタブ | 中 |
| `src/typescript/setup.ts` | MV 用 tsconfig（`rpg_` 参照） | 小 |

## 実装順序

### Phase 1: リネーム＆基盤（1日）
1. `rmmz` → `rmmv` の全リネーム（コマンドID、メッセージキー、パッケージ名）
2. `package.json` の更新（名前、説明、キーワード）
3. README 書き換え
4. ビルド確認

### Phase 2: アノテーション体系の MV 化（1日）
1. `tags.ts` から MZ 専用タグを除去
2. `completionProvider.ts` の補完候補を MV 用に調整
3. `validator.ts` の MZ 専用バリデーションを除去
4. `langSync.ts` の `@command`/`@arg` チェックを除去
5. テンプレート・スニペットを MV パターンに変更
6. tmLanguage のハイライト調整
7. テスト更新

### Phase 3: MV 型定義（2〜3日）
1. MV コアスクリプト（`rpg_*.js`）を読み、型定義を作成
2. PIXI.js v4 スタブ作成
3. グローバル変数・RPG データ型定義
4. `typescript/setup.ts` を MV 用に調整
5. テストプロジェクトで IntelliSense 動作確認

### Phase 4: テスト＆リリース（1日）
1. 全テスト更新・追加
2. MV テストプロジェクトでの目視確認
3. VSIX ビルド・検証
4. Marketplace / Gumroad 登録

## MV テストプロジェクト

型定義作成のソース:
```
D:\dev\rpgmaker\rpgmaker-mcp-private\test-projects\test-mv\js\rpg_*.js
```

※ MV テストプロジェクトが存在しない場合は Steam から RPG Maker MV の新規プロジェクトを作成する。

## 注意事項

- MV のバージョン差異（1.5 vs 1.6、Community 版）に注意。型定義は最新の 1.6.x ベースで作成
- MZ 版との共通コードの修正は cherry-pick で同期する（バグ修正等）
- Gumroad は別製品として登録（ライセンスキーは MZ 版と共用しない）
- `@command`/`@arg` は MV にないが、一部の MV プラグインが独自にこれらのタグを使っている場合がある（VisuStella 等）。初版ではサポートしない
