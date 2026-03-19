# TypeScript フルサポート — 目視確認テストプラン

自動テスト（227件パス済み）ではカバーできない、VS Code UI 操作・実際のファイル I/O・ゲーム連携が必要な確認項目。

---

## 前提条件

- VS Code で拡張を F5 デバッグ起動
- テストプロジェクト: `D:\dev\rpgmaker\rpgmaker-mcp-private\test-projects\test-mz`
- テストプロジェクトの `node_modules` に typescript がインストール済み
  ```
  cd D:\dev\rpgmaker\rpgmaker-mcp-private\test-projects\test-mz
  npm init -y && npm install typescript --save-dev
  ```

---

## 1. Setup TypeScript コマンド

### 1-1. 初回セットアップ（ファイルなしの状態から）

**手順:**
1. テストプロジェクトに `tsconfig.json`, `ts/` フォルダが存在しないことを確認（あれば削除）
2. コマンドパレット → `RMMZ: Setup TypeScript` を実行
3. Pro ライセンスが未認証の場合、Pro 機能のプロンプトが出ることを確認

**確認項目:**
- [ ] `tsconfig.json` がプロジェクトルートに作成される
- [ ] `ts/plugins/` ディレクトリが作成される
- [ ] `ts/typings/rmmz/` ディレクトリに以下の `.d.ts` ファイルがコピーされる:
  - `pixi.d.ts`
  - `rmmz_core.d.ts`
  - `rmmz_managers.d.ts`
  - `rmmz_objects.d.ts`
  - `rmmz_scenes.d.ts`
  - `rmmz_sprites.d.ts`
  - `rmmz_windows.d.ts`
  - `rmmz_globals.d.ts`
- [ ] 成功メッセージが通知される
- [ ] `tsconfig.json` の内容が正しい（以下と一致）:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "none",
    "outDir": "js/plugins",
    "rootDir": "ts/plugins",
    "removeComments": false,
    "strict": true,
    "sourceMap": true,
    "declaration": false,
    "skipLibCheck": true,
    "lib": ["ES2020", "DOM"]
  },
  "include": ["ts/plugins/**/*.ts", "ts/typings/**/*.d.ts"],
  "exclude": ["node_modules", "js"]
}
```

### 1-2. 既存 tsconfig.json がある場合の上書き確認

**手順:**
1. 1-1 完了後（`tsconfig.json` が存在する状態）
2. 再度 `RMMZ: Setup TypeScript` を実行

**確認項目:**
- [ ] 「tsconfig.json が既に存在します。上書きしますか？」のプロンプトが表示される
- [ ] 「キャンセル」を選ぶと何も変更されない
- [ ] 「上書き」を選ぶと tsconfig.json が再生成される

---

## 2. 型定義の動作確認

### 2-1. IntelliSense が効くことの確認

**手順:**
1. 1-1 完了後、`ts/plugins/TestTypes.ts` を以下の内容で作成:

```typescript
// ======================================================
// 型定義の目視確認用テストプラグイン
// ======================================================
// 各セクションで、ホバー時に型情報が表示されること、
// 補完候補が出ること、型エラーが正しく表示されることを確認する。
//
// 注意: プラグインはファイル読み込み時に即実行されるため、
// $gameParty 等のゲームオブジェクトはまだ null。
// 実行時にアクセスするコードは prototype override 内に置く。

/*:
 * @target MZ
 * @plugindesc TypeScript 型定義テスト
 * @author Test
 */

(() => {
  "use strict";

  // ── 2-1a: $data グローバル変数（読み込み時点で利用可能） ──
  // 確認: $dataActors にホバー → (RPG_Actor | null)[] 型が表示される
  // 確認: $dataSystem にホバー → RPG_System 型が表示される

  // ── 2-1b: コアクラス ─────────────────────────────
  // 確認: Bitmap にホバー → declare class Bitmap と表示される
  const bmp = new Bitmap(100, 100);
  // 確認: bmp. と入力 → drawText, fillRect, clear 等が補完候補に出る
  bmp.drawText("hello", 0, 0, 100, 36, "center");

  // 確認: 引数型の不一致でエラーになること
  // 以下の行はエラー（数値に文字列を渡している）が赤波線で表示されるべき:
  // bmp.drawText(123, "wrong", "wrong", "wrong", "wrong");

  // ── 2-1c: マネージャクラス ────────────────────────
  // 確認: SceneManager. と入力 → goto, push, pop 等が補完候補に出る
  // 確認: AudioManager. と入力 → playBgm, playSe 等が補完候補に出る
  // 確認: DataManager. と入力 → loadDatabase, saveGame 等が補完候補に出る

  // ── 2-1d: ゲームオブジェクト（prototype override 内で確認） ──
  // $gameParty 等はゲーム開始後にしか使えないため、override 内で確認する。
  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function(this: Scene_Map) {
    _Scene_Map_start.call(this);

    // 確認: $gameParty にホバー → Game_Party 型が表示される
    // 確認: .leader() にホバー → Game_Actor を返す関数と表示される
    const leader = $gameParty.leader();

    // 確認: leader. と入力 → Game_Actor のメソッド一覧が補完候補に出る
    //   name(), level, atk, def, isAlive() 等が見える
    const name = leader.name();
    const level = leader.level;

    // 確認: $dataActors にホバー → (RPG_Actor | null)[] 型が表示される
    const actor = $dataActors[1];

    // 確認: actor?. と入力 → RPG_Actor のプロパティが補完候補に出る
    //   name, classId, traits, equips 等が見える
    const actorName = actor?.name;

    // 確認: $gameMap. と入力 → tileWidth(), events(), displayX() 等が出る
    const mapWidth = $gameMap.width();
    const tileW = $gameMap.tileWidth();

    // 確認: $gamePlayer. と入力 → moveStraight, isMoving 等が出る
    const px = $gamePlayer.x;
    const py = $gamePlayer.y;

    console.log("TypeScript型定義テスト:", name, level, actorName, mapWidth, tileW, px, py);
  };

  // ── 2-1e: シーン・ウィンドウ ──────────────────────
  // 確認: Scene_Map, Scene_Battle, Window_Base 等がグローバルに認識される
  // 確認: Window_Base.prototype. と入力 → drawText, drawIcon 等が出る
  // 確認: 型のないメソッドや存在しないプロパティでエラーが出ること
})();
```

**確認項目:**
- [ ] 各コメントの「確認:」項目がすべて期待通り動作する
- [ ] 型エラーのある行（コメントアウトされた行をアンコメントした場合）に赤波線が出る
- [ ] `$gameParty`, `$dataActors`, `SceneManager` 等の型がホバーで正しく表示される

### 2-2. 存在しない型でエラーが出ることの確認

**手順:**
1. `ts/plugins/TestTypeError.ts` を以下の内容で作成:

```typescript
/*:
 * @target MZ
 * @plugindesc 型エラー確認用
 * @author Test
 */

(() => {
  "use strict";

  // ── 2-2a: 存在しないメソッド → エラーになるべき ──
  // 確認: 以下の行に赤波線が出る（nonExistentMethod は Game_Party にない）
  $gameParty.nonExistentMethod();

  // ── 2-2b: 型の不一致 → エラーになるべき ──
  // 確認: 以下の行に赤波線が出る（fontSize は number 型なのに string を代入）
  const bmp = new Bitmap(100, 100);
  bmp.fontSize = "large"; // ← ここに赤波線が出るべき（Type 'string' is not assignable to type 'number'）

  // ── 2-2c: プラグインコマンド引数の型 ──
  // 確認: registerCommand が認識され、コールバック引数が正しく推論される
  PluginManager.registerCommand("Test", "cmd", (args) => {
    // args は any になるが、registerCommand 自体がエラーにならない
    console.log(args);
  });
})();
```

**確認項目:**
- [ ] `nonExistentMethod` にエラーが出る
- [ ] `PluginManager.registerCommand` がエラーなく使用できる

---

## 3. 自動ビルド（TS Auto-Build）

### 3-1. ステータスバーの状態遷移

**手順:**
1. VS Code 右下のステータスバーに「TS Build: Off」が表示されていることを確認
2. コマンドパレット → `RMMZ: Toggle TypeScript Auto-Build` を実行
3. ステータスバーの表示が変化することを確認

**確認項目:**
- [ ] 初期状態: `$(circle-slash) TS Build: Off` が表示される
- [ ] 有効化直後: `$(eye) TS Build: Watching` → ビルド実行中は `$(sync~spin) TS Build: Building...`
- [ ] ビルド成功後: `$(check) TS Build: OK`
- [ ] 再度トグル → `$(circle-slash) TS Build: Off` に戻る

### 3-2. ファイル保存時の自動ビルド

**手順:**
1. Auto-Build を有効化
2. `ts/plugins/TestTypes.ts`（2-1 で作成済み）を開く
3. ファイルを軽微に変更して保存（例: コメント追加）
4. `js/plugins/TestTypes.js` と `js/plugins/TestTypes.js.map` を確認

**確認項目:**
- [ ] 保存後にステータスバーが `Building...` → `OK` と遷移する
- [ ] `js/plugins/TestTypes.js` が生成される
- [ ] `js/plugins/TestTypes.js.map` が生成される
- [ ] 生成された `.js` ファイルに `/*:` アノテーションブロックが**保持されている**
  （`removeComments: false` の検証）

### 3-3. tsc エラー時の Problems パネル表示

**手順:**
1. Auto-Build が有効な状態
2. `ts/plugins/TestTypes.ts` に意図的な型エラーを追加:
   ```typescript
   const x: number = "not a number";
   ```
3. 保存

**確認項目:**
- [ ] ステータスバーが `$(error) TS Build: Error` になる（赤背景）
- [ ] Problems パネル（Ctrl+Shift+M）にエラーが表示される
- [ ] エラーメッセージにファイル名、行番号、TS エラーコードが含まれる
- [ ] エラーをクリックすると該当行にジャンプする
- [ ] エラーを修正して保存 → ステータスバーが `OK` に戻り、Problems が消える

### 3-4. typescript 未インストール時のエラーメッセージ

**手順:**
1. テストプロジェクトの `node_modules` を一時的にリネーム
2. Auto-Build を有効化して `.ts` ファイルを保存

**確認項目:**
- [ ] `npm install typescript --save-dev` を促すエラーメッセージが表示される
- [ ] `node_modules` を元に戻すと正常にビルドされる

---

## 4. デバッガー ソースマップ対応

### 4-1. launch.json に sourceMapPathOverrides が含まれること

**手順:**
1. `.vscode/launch.json` が存在しない状態にする（あれば削除）
2. コマンドパレット → `RMMZ: Setup Debugger` を実行
3. 生成された `.vscode/launch.json` を開く

**確認項目:**
- [ ] launch 設定に `sourceMapPathOverrides` が含まれる:
  ```json
  "sourceMapPathOverrides": {
    "ts/plugins/*": "${workspaceFolder}/ts/plugins/*"
  }
  ```
- [ ] attach 設定にも同じ `sourceMapPathOverrides` が含まれる

### 4-2. .ts ファイルでブレークポイントが止まること

**手順:**
1. 4-1 完了後
2. Auto-Build で `ts/plugins/TestTypes.ts` をビルド済みにする
   （`js/plugins/TestTypes.js` が存在することを確認）
3. プラグインを有効化する（以下のいずれかの方法）:
   - **方法A: MZ エディタを使う場合**
     RPG Maker MZ でプロジェクトを開く → ツール → プラグイン管理 →
     空行をダブルクリック → 名前ドロップダウンから `TestTypes` を選択 →
     「状態」を ON にして OK → 保存
   - **方法B: 直接編集する場合**
     `js/plugins.js` を開き、`$plugins` 配列に以下を追加:
     ```js
     {"name":"TestTypes","status":true,"description":"","parameters":{}}
     ```
4. `ts/plugins/TestTypes.ts` の適当な行にブレークポイントを設定
5. F5 で `RMMZ Testplay (Debug)` を実行

**確認項目:**
- [ ] ゲームが起動する
- [ ] ブレークポイントで実行が停止する
- [ ] 停止時に表示されるのが `.ts` ファイル（`.js` ではない）である
- [ ] 変数のホバー・ウォッチが動作する

---

## 5. テンプレート生成 TS 対応

### 5-1. 言語選択ステップの表示

**手順:**
1. コマンドパレット → `RMMZ: New Plugin` を実行
2. プラグイン名、メタデータ、機能選択を入力
3. 最後に言語選択ステップが表示されることを確認

**確認項目:**
- [ ] 「JavaScript」と「TypeScript (Pro)」の選択肢が表示される
- [ ] 各選択肢にディレクトリ説明が付いている（`js/plugins/` / `ts/plugins/`）

### 5-2. TypeScript テンプレート生成

**手順:**
1. 5-1 で TypeScript を選択
2. 全機能（Plugin Command, Parameters）を有効にして生成

**確認項目:**
- [ ] `ts/plugins/<プラグイン名>.ts` が作成される（`js/plugins/` ではない）
- [ ] ファイルが自動で開かれる
- [ ] アノテーションブロック（`/*: ... */`）が含まれる
- [ ] `@target MZ`, `@plugindesc`, `@author` が含まれる
- [ ] `@param`, `@command`, `@arg` が含まれる
- [ ] `registerCommand` のコールバックが `(args) =>` の形式（型は `Record<string, string>` から推論）
- [ ] コメント例に `this: Game_Player` の型付きエイリアスパターンがある
- [ ] IIFE ラッパー `(() => { ... })();` で囲まれている
- [ ] `"use strict"` が含まれる

### 5-3. JavaScript テンプレートに影響がないこと

**手順:**
1. `RMMZ: New Plugin` → JavaScript を選択して生成

**確認項目:**
- [ ] `js/plugins/<プラグイン名>.js` が作成される
- [ ] 型注釈（`: string`, `: number` 等）が含まれ**ない**
- [ ] 従来のテンプレートと同一の構造

---

## 6. サイドバー Quick Actions

### 6-1. ボタンの表示確認

**手順:**
1. アクティビティバーの RMMZ アイコンをクリック
2. Quick Actions パネルの Setup セクションを確認

**確認項目:**
- [ ] 「Setup TypeScript」ボタンが表示される（PRO バッジ付き）
- [ ] 「Toggle TS Auto-Build」ボタンが表示される（PRO バッジ付き）
- [ ] 既存のボタン（Setup IntelliSense, Setup Debugger, Prepare for Release）が引き続き表示される
- [ ] 各ボタンをクリックすると対応するコマンドが実行される

---

## 7. スニペット

### 7-1. TS スニペットの動作確認

**手順:**
1. `ts/plugins/` 内の `.ts` ファイルを開く
2. 以下のスニペットプレフィックスを入力して補完候補を確認:

**確認項目:**
- [ ] `rmmz-alias` → `this: ClassName` 付きの型付きエイリアスパターンが展開される
- [ ] `rmmz-command` → `args: { key: string }` 型付きプラグインコマンド登録が展開される
- [ ] `rmmz-plugin` → フルプラグインスキャフォールドが展開される
- [ ] `rmmz-param` → パラメータパースが展開される
- [ ] `rmmz-iife` → IIFE ラッパーが展開される

### 7-2. JS スニペットが TS ファイルで出ないこと

**手順:**
1. `.ts` ファイルで `rmmz-scene` を入力

**確認項目:**
- [ ] JS 向けスニペット（`rmmz-scene`, `rmmz-window`, `rmmz-sprite`）が `.ts` ファイルでは表示されない
  （`scope: "javascript"` のため）

### 7-3. JS スニペットが JS ファイルで引き続き動作すること

**手順:**
1. `js/plugins/` 内の `.js` ファイルで `rmmz-alias` を入力

**確認項目:**
- [ ] 従来の JS 向けスニペットが正常に展開される（`this:` 型注釈なし）

---

## 8. VSIX パッケージング

### 8-1. typings/ がバンドルに含まれること

**手順:**
```bash
cd D:\dev\rpgmaker\rmmz-dev-tools
npx vsce package --no-dependencies 2>&1
# 生成された .vsix を unzip して中身を確認
```

**確認項目:**
- [ ] `.vsix` 内に `extension/typings/rmmz/` ディレクトリが含まれる
- [ ] 8 つの `.d.ts` ファイルがすべて含まれる
- [ ] `extension/snippets/rmmz-ts.code-snippets.json` が含まれる
- [ ] `extension/out/typescript/setup.js` が含まれる
- [ ] `extension/out/typescript/autoBuild.js` が含まれる

---

## 9. 日本語ローカライゼーション

### 9-1. 日本語環境でのメッセージ表示

**手順:**
1. VS Code の言語設定を日本語に変更（`"locale": "ja"`）
2. 各コマンドを実行

**確認項目:**
- [ ] `RMMZ: Setup TypeScript` → コマンドパレットに「RMMZ: TypeScriptセットアップ」と表示される
- [ ] `RMMZ: Toggle TypeScript Auto-Build` → 「RMMZ: TypeScript自動ビルド切替」と表示される
- [ ] Setup 実行時のメッセージが日本語（「TypeScript環境をセットアップしました...」）
- [ ] 上書き確認が日本語（「tsconfig.jsonが既に存在します...」）
- [ ] Auto-Build のステータスバーが日本語（「TSビルド: オフ」等）
- [ ] サイドバーのボタンラベルが日本語（「TypeScriptセットアップ」「TS自動ビルド切替」）

---

## 10. エンドツーエンド統合テスト

### 10-1. TS プラグインの完全なワークフロー

**手順:**
1. テストプロジェクトで `RMMZ: Setup TypeScript` を実行
2. `RMMZ: New Plugin` → TypeScript → 全機能有効 → 名前 `E2E_TestPlugin`
3. `RMMZ: Toggle TypeScript Auto-Build` を有効化
4. 生成された `ts/plugins/E2E_TestPlugin.ts` を保存
5. `js/plugins/E2E_TestPlugin.js` が生成されることを確認
6. RPG Maker MZ で `E2E_TestPlugin` をプラグインリストに追加
7. テストプレイを起動

**確認項目:**
- [ ] `ts/plugins/E2E_TestPlugin.ts` にアノテーション支援（ハイライト・補完）が効く
- [ ] 保存 → 自動ビルド → `js/plugins/E2E_TestPlugin.js` 生成
- [ ] 生成された `.js` にアノテーションブロックが保持されている
- [ ] RPG Maker MZ のプラグインマネージャで認識される
  （パラメータ・プラグインコマンドが表示される）
- [ ] テストプレイが正常に起動する（プラグインが原因のエラーなし）
- [ ] Quick Scene Reload が有効な場合: `.ts` 保存 → ビルド → `.js` 更新 →
  シーンリロード が連鎖的に動作する
