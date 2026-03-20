import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { t } from '../i18n';
import { isProLicensed } from '../license/gumroad';

interface PluginInfo {
  name: string;
  author: string;
  description: string;
  url: string;
  hasCommands: boolean;
  hasParameters: boolean;
  language: 'javascript' | 'typescript';
}

/**
 * Prompts the user for plugin info and generates a scaffold file.
 */
export async function generatePluginTemplate(): Promise<void> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) {
    vscode.window.showErrorMessage(t('noWorkspaceFolder'));
    return;
  }

  // Find the plugins directory
  let pluginsDir: string | undefined;
  for (const folder of folders) {
    const candidate = path.join(folder.uri.fsPath, 'js', 'plugins');
    if (fs.existsSync(candidate)) {
      pluginsDir = candidate;
      break;
    }
  }

  if (!pluginsDir) {
    pluginsDir = folders[0].uri.fsPath;
  }

  // ── Step 1: Plugin name (required) ──
  const name = await vscode.window.showInputBox({
    title: t('template.step1Title'),
    prompt: t('template.pluginNamePrompt'),
    placeHolder: t('template.pluginNamePlaceholder'),
    validateInput: (v) => {
      if (!v) return t('template.pluginNameRequired');
      if (!/^[a-zA-Z_]\w*$/.test(v)) return t('template.pluginNameInvalid');
      const existing = path.join(pluginsDir!, `${v}.js`);
      if (fs.existsSync(existing)) return t('template.pluginNameExists', v);
      return undefined;
    },
  });
  if (!name) return;

  // ── Step 2: Metadata (author, description, url) ──
  const author = await vscode.window.showInputBox({
    title: t('template.step2Title'),
    prompt: t('template.authorPrompt'),
    placeHolder: t('template.authorPlaceholder'),
  });
  if (author === undefined) return;

  const description = await vscode.window.showInputBox({
    title: t('template.step2Title'),
    prompt: t('template.descPrompt'),
    placeHolder: t('template.descPlaceholder'),
  });
  if (description === undefined) return;

  const url = await vscode.window.showInputBox({
    title: t('template.step2Title'),
    prompt: t('template.urlPrompt'),
    placeHolder: t('template.urlPlaceholder'),
  });
  if (url === undefined) return;

  // ── Step 3: Features ──
  const featureCommandLabel = t('template.featureCommand');
  const featureParamsLabel = t('template.featureParams');
  const features = await vscode.window.showQuickPick(
    [
      { label: featureCommandLabel, description: t('template.featureCommandDesc'), picked: true },
      { label: featureParamsLabel, description: t('template.featureParamsDesc'), picked: true },
    ],
    {
      title: t('template.step3Title'),
      placeHolder: t('template.selectFeatures'),
      canPickMany: true,
    }
  );
  if (!features) return;

  const hasCommands = features.some(f => f.label === featureCommandLabel);
  const hasParameters = features.some(f => f.label === featureParamsLabel);

  // ── Language choice (JS or TS) ──
  let language: 'javascript' | 'typescript' = 'javascript';
  const tsPluginsDir = path.join(folders[0].uri.fsPath, 'ts', 'plugins');
  const hasTsSetup = fs.existsSync(tsPluginsDir);

  if (hasTsSetup || isProLicensed()) {
    const jsLabel = t('template.languageJS');
    const tsLabel = t('template.languageTS');
    const langChoice = await vscode.window.showQuickPick(
      [
        { label: jsLabel, description: 'js/plugins/', value: 'javascript' as const },
        { label: tsLabel, description: 'ts/plugins/', value: 'typescript' as const },
      ],
      { placeHolder: t('template.languageChoice') }
    );
    if (!langChoice) return;
    language = langChoice.value;
  }

  const info: PluginInfo = {
    name,
    author: author || 'Author',
    description: description || '',
    url: url || '',
    hasCommands,
    hasParameters,
    language,
  };

  const content = language === 'typescript' ? buildTypeScriptTemplate(info) : buildTemplate(info);
  const ext = language === 'typescript' ? '.ts' : '.js';
  const targetDir = language === 'typescript' ? tsPluginsDir : pluginsDir;
  const filePath = path.join(targetDir, `${name}${ext}`);

  if (fs.existsSync(filePath)) {
    const overwriteBtn = t('intellisense.overwrite');
    const overwrite = await vscode.window.showWarningMessage(
      t('template.overwritePrompt', name),
      overwriteBtn,
      t('intellisense.cancel')
    );
    if (overwrite !== overwriteBtn) return;
  }

  // Ensure target directory exists (for ts/plugins/)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf-8');

  const doc = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(doc);
  vscode.window.showInformationMessage(t('template.created', name));
}

function buildTemplate(info: PluginInfo): string {
  const lines: string[] = [];

  // Annotation block
  lines.push('/*:');
  lines.push(' * @target MV');
  lines.push(` * @plugindesc ${info.description}`);
  lines.push(` * @author ${info.author}`);
  if (info.url) {
    lines.push(` * @url ${info.url}`);
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

  // Plugin body
  lines.push('(function() {');
  lines.push('  "use strict";');
  lines.push('');
  lines.push(`  var PLUGIN_NAME = "${info.name}";`);
  lines.push('');

  if (info.hasParameters) {
    lines.push('  var parameters = PluginManager.parameters(PLUGIN_NAME);');
    lines.push('  var param = {');
    lines.push('    enabled: parameters["enabled"] === "true",');
    lines.push('    displayName: parameters["displayName"] || "Default",');
    lines.push('  };');
    lines.push('');
  }

  if (info.hasCommands) {
    lines.push('  // Plugin command handler');
    lines.push('  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;');
    lines.push('  Game_Interpreter.prototype.pluginCommand = function(command, args) {');
    lines.push('    _Game_Interpreter_pluginCommand.call(this, command, args);');
    lines.push(`    if (command === PLUGIN_NAME) {`);
    lines.push('      switch (args[0]) {');
    lines.push('        case "showMessage":');
    lines.push('          var text = args[1] || "Hello!";');
    lines.push('          // TODO: Implement your command logic here');
    lines.push('          console.log(PLUGIN_NAME + ": " + text);');
    lines.push('          break;');
    lines.push('      }');
    lines.push('    }');
    lines.push('  };');
    lines.push('');
  }

  lines.push('  // TODO: Add your plugin logic here');
  lines.push('  //');
  lines.push('  // Example: Override a method');
  lines.push('  // var _alias = Game_Player.prototype.update;');
  lines.push('  // Game_Player.prototype.update = function(sceneActive) {');
  lines.push('  //   _alias.call(this, sceneActive);');
  lines.push('  //   // Your logic here');
  lines.push('  // };');
  lines.push('');
  lines.push('})();');
  lines.push('');

  return lines.join('\n');
}

function buildTypeScriptTemplate(info: PluginInfo): string {
  const lines: string[] = [];

  // Annotation block (identical to JS — removeComments: false preserves it)
  lines.push('/*:');
  lines.push(' * @target MV');
  lines.push(` * @plugindesc ${info.description}`);
  lines.push(` * @author ${info.author}`);
  if (info.url) {
    lines.push(` * @url ${info.url}`);
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

  // TypeScript plugin body
  lines.push('((): void => {');
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
    lines.push('  // Plugin command handler');
    lines.push('  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;');
    lines.push('  Game_Interpreter.prototype.pluginCommand = function(this: Game_Interpreter, command: string, args: string[]): void {');
    lines.push('    _Game_Interpreter_pluginCommand.call(this, command, args);');
    lines.push(`    if (command === PLUGIN_NAME) {`);
    lines.push('      switch (args[0]) {');
    lines.push('        case "showMessage":');
    lines.push('          const text = args[1] || "Hello!";');
    lines.push('          // TODO: Implement your command logic here');
    lines.push('          console.log(`${PLUGIN_NAME}: ${text}`);');
    lines.push('          break;');
    lines.push('      }');
    lines.push('    }');
    lines.push('  };');
    lines.push('');
  }

  lines.push('  // TODO: Add your plugin logic here');
  lines.push('  //');
  lines.push('  // Example: Override a method with typed alias');
  lines.push('  // const _Game_Player_update = Game_Player.prototype.update;');
  lines.push('  // Game_Player.prototype.update = function(this: Game_Player, sceneActive: boolean): void {');
  lines.push('  //   _Game_Player_update.call(this, sceneActive);');
  lines.push('  //   // Your logic here');
  lines.push('  // };');
  lines.push('');
  lines.push('})();');
  lines.push('');

  return lines.join('\n');
}
