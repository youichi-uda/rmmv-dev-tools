# RMMV Dev Tools 手動テスト手順書

対象: v1.1.0
テスト環境: test-mv (RPG Maker MV v1.6.3)

## 前提条件

1. VS Code で `test-mv` フォルダを開く
2. RMMV Dev Tools 拡張がアクティブ（他の類似拡張は無効化）
3. Pro ライセンスを有効化済み（`Ctrl+Shift+P` → `RMMV: Activate License`）

---

## 自動テスト済み（結果確認のみ）

以下は Maestro 経由で動作確認済み。目視で表示を確認するだけでOK。

### T01: Database Browser
- サイドバー「RMMV」→「Database Browser」を開く
- Actors, Items, Weapons 等のカテゴリが表示されていること
- 各エントリをクリックしてデータが表示されること

### T02: Conflict Detection
- `Problems` パネルを開く（`Ctrl+Shift+M`）
- `EnemyBook.js` に Warning 1件:
  `Game_Interpreter.prototype.pluginCommand overridden without alias — also modified by [ItemBook]`
- `ItemBook.js` にも対応する Warning 1件
- **各ファイル1件ずつ**であること（重複していないこと）

### T03: Asset Check
- `Ctrl+Shift+P` → `RMMV: Check Asset References`
- Output Channel「RMMV Assets」に `0 warning(s) found` と表示

### T04: IntelliSense Setup
- `Ctrl+Shift+P` → `RMMV: Setup IntelliSense`
- `jsconfig.json` がプロジェクトルートに生成される
- コアスクリプト（`js/rpg_core.js` 等）の型補完が効くこと

---

## 手動テスト項目

### T05: Annotation Formatter (Free)
**目的**: アノテーションブロックのフォーマッタが正常動作すること

1. `js/plugins/Community_Basic.js` を開く
2. カーソルを `/*:` ブロック内（例: 5行目付近）に置く
3. `Ctrl+Shift+P` → `RMMV: Format Annotation`
4. 確認:
   - [ ] `@plugindesc`, `@author` が先頭に来ること
   - [ ] `@param` ブロックが元の順序を保っていること
   - [ ] `@help` がブロック末尾に移動すること
   - [ ] 全行のインデントが ` * @tag` 形式に統一されること
5. `Ctrl+Z` で元に戻す

### T06: Annotation Preview (Pro)
**目的**: Plugin Manager 風プレビューが表示されること

1. `js/plugins/Community_Basic.js` を開く
2. カーソルをアノテーションブロック内に置く
3. `Ctrl+Shift+P` → `RMMV: Preview Annotation`
4. 確認:
   - [ ] 右側にWebviewパネルが開く
   - [ ] Plugin Manager のようなUI でパラメータ一覧が表示
   - [ ] `/*:ja` ブロックにカーソルを移動 → 日本語版に切り替わる

### T07: Plugin Template (Free)
**目的**: 新規プラグインテンプレートが生成されること

1. `Ctrl+Shift+P` → `RMMV: New Plugin`
2. ファイル名入力欄に `TestPlugin` と入力
3. 確認:
   - [ ] `js/plugins/TestPlugin.js` が生成される
   - [ ] `/*:` アノテーションブロックのテンプレートが含まれる
   - [ ] IIFE (`(function() { ... })();`) の基本構造がある
4. テスト後、生成ファイルを削除

### T08: Dependency Graph (Pro)
**目的**: プラグイン依存関係グラフが表示されること

1. `Ctrl+Shift+P` → `RMMV: Show Dependency Graph`
2. 確認:
   - [ ] Webview パネルが開く
   - [ ] プラグイン一覧がノードとして表示される
   - [ ] `@base`, `@orderAfter`, `@orderBefore` の依存関係が矢印で表示される
   - [ ] （test-mvのプラグインは依存関係なしなので、独立ノードのみでOK）

### T09: Class Hierarchy (Pro)
**目的**: RPG Maker クラスの継承ツリーが表示されること

1. サイドバー「RMMV」→「Class Hierarchy」を開く
2. リフレッシュボタンをクリック
3. 確認:
   - [ ] Scene_Base → Scene_Map, Scene_Title 等の階層が表示
   - [ ] Window_Base → Window_Selectable 等の階層が表示
   - [ ] Sprite_Base → Sprite_Character 等の階層が表示
   - [ ] エントリクリックで対応するソースコードにジャンプ

### T10: Note Tag Index (Free) / Note Tag Editor (Pro)
**目的**: データファイルの note タグを閲覧・編集できること

1. サイドバー「RMMV」→「Note Tag Index」を開く
2. リフレッシュボタンをクリック
3. 確認（Index）:
   - [ ] データファイル（Actors, Items 等）からノートタグが抽出される
   - [ ] エントリクリックでタグの場所にジャンプ
4. `Ctrl+Shift+P` → `RMMV: Edit Note Tags`
5. 確認（Editor - Pro）:
   - [ ] Webview エディタが開く
   - [ ] データベース項目の note フィールドを編集できる

### T11: TypeScript Setup (Pro)
**目的**: TypeScript 環境が構築されること

1. `Ctrl+Shift+P` → `RMMV: Setup TypeScript`
2. 確認:
   - [ ] `tsconfig.json` が生成される
   - [ ] `src/` ディレクトリが作成される（またはプロンプトが出る）
   - [ ] `.ts` ファイルでコアスクリプトの型補完が効く
3. テスト後、生成ファイルを削除

### T12: Debugger Setup (Pro)
**目的**: デバッグ設定が生成されること

1. `Ctrl+Shift+P` → `RMMV: Setup Debugger`
2. 確認:
   - [ ] `.vscode/launch.json` が生成/更新される
   - [ ] NW.js 用のデバッグ構成が含まれる
   - [ ] `package.json` の `chromium-args` にデバッグポートが設定される
3. テスト後、生成ファイルを元に戻す

### T13: Console Capture (Pro)
**目的**: テストプレイ中のコンソール出力をキャプチャできること

**前提**: RPG Maker MV エディタからテストプレイを起動

1. RPG Maker MV でプロジェクトを開きテストプレイ開始
2. VS Code で `Ctrl+Shift+P` → `RMMV: Show Console`
3. 確認:
   - [ ] Output Channel「RMMV Console」にゲームのログが表示
   - [ ] `console.log()` の出力がリアルタイムで流れる
   - [ ] エラーが赤色で強調表示される

### T14: Game State Inspector (Pro)
**目的**: 実行中ゲームの状態を閲覧できること

**前提**: テストプレイが起動中

1. サイドバー「RMMV」→「Game State」を開く
2. リフレッシュボタンをクリック
3. 確認:
   - [ ] パーティ情報（メンバー、HP/MP）が表示
   - [ ] 所持金が表示
   - [ ] スイッチ/変数の値が表示
   - [ ] 自動リフレッシュを ON にして値がリアルタイム更新

### T15: Scene Reload (Pro)
**目的**: プラグインファイル保存時にゲームシーンが再読み込みされること

**前提**: テストプレイが起動中

1. `Ctrl+Shift+P` → `RMMV: Toggle Scene Reload` → ON にする
2. プラグインファイルを編集して保存
3. 確認:
   - [ ] ゲーム画面が自動的にリロードされる
   - [ ] タイトル画面に戻らず、現在のシーンで再開される

### T16: Live Preview (Pro)
**目的**: ゲーム画面のスクリーンショットがVS Code内で表示されること

**前提**: テストプレイが起動中

1. `Ctrl+Shift+P` → `RMMV: Show Live Preview`
2. 確認:
   - [ ] Webview にゲーム画面のスクリーンショットが表示
   - [ ] 定期的に更新される

### T17: Plugin Registry (Pro)
**目的**: プラグイン更新チェックが動作すること

1. `Ctrl+Shift+P` → `RMMV: Check Plugin Updates`
2. 確認:
   - [ ] ワークスペース内のプラグインがスキャンされる
   - [ ] 更新情報がある場合は通知が表示される
   - [ ] エラーが出ないこと

### T18: Data Hover (Pro)
**目的**: プラグインコード中のデータ参照でホバープレビューが出ること

1. `js/plugins/EnemyBook.js` を開く
2. コード中の `$dataEnemies[N]` や `$gameSwitches.value(N)` 等にカーソルを合わせる
3. 確認:
   - [ ] ホバーでデータの名前や値がプレビュー表示される
   - [ ] `a.atk * 4 - b.def * 2` 等のダメージ計算式でプレビューが出る（あれば）

### T19: Completion / Hover / Validation (Free)
**目的**: アノテーション編集支援が動作すること

1. 新しい `.js` ファイルを作成し、`/*:` と入力
2. 次の行で `@` を入力
3. 確認（Completion）:
   - [ ] `@plugindesc`, `@param`, `@help` 等の補完候補が表示
   - [ ] `@type ` の後に `string`, `number`, `boolean` 等の型候補が表示
4. 確認（Hover）:
   - [ ] `@plugindesc` にカーソルを合わせるとドキュメントが表示
   - [ ] `@type select` 等にカーソルを合わせると説明が表示
5. 確認（Validation）:
   - [ ] 存在しないタグ（例: `@foobar`）に Warning が出る
   - [ ] `@plugindesc` がない場合に Warning が出る

### T20: Color Picker (Free)
**目的**: `@default` の16進カラーでカラーピッカーが使えること

1. プラグインファイルのアノテーション内に `@default #ff0000` と記述
2. 確認:
   - [ ] `#ff0000` の横にカラーデコレータ（色付き四角）が表示
   - [ ] クリックするとカラーピッカーが開く
   - [ ] 色を変更すると `@default` の値が更新される

### T21: Prepare for Release (Free)
**目的**: リリース準備コマンドが動作すること

1. `Ctrl+Shift+P` → `RMMV: Prepare for Release`
2. 確認:
   - [ ] `package.json` からデバッグ用 `chromium-args` が除去される
   - [ ] 確認ダイアログが表示されること

---

## テストプレイが必要な項目まとめ

| テスト | テストプレイ必要 |
|--------|:---:|
| T13: Console Capture | Yes |
| T14: Game State Inspector | Yes |
| T15: Scene Reload | Yes |
| T16: Live Preview | Yes |
| その他 | No |

テストプレイなしで実施可能: T05-T12, T17-T21
