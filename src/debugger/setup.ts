import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { t } from '../i18n';

const CHROMIUM_ARGS = '--remote-debugging-port=9222';

/** Suppress watcher restore after intentional removal (prepareRelease). */
let suppressRestoreUntil = 0;

/**
 * Resolves the nw.exe / Game.exe path for MV.
 * MV projects typically have Game.exe in the project root,
 * or the MV editor install folder contains nw.exe directly.
 */
export async function resolveNwExePath(projectRoot?: string): Promise<string | undefined> {
  // First, check project root for Game.exe or nw.exe (MV project structure)
  if (projectRoot) {
    const candidates = [
      path.join(projectRoot, 'Game.exe'),
      path.join(projectRoot, 'nw.exe'),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  // Check configured install path
  const config = vscode.workspace.getConfiguration('rmmv');
  let installPath: string = config.get('rmmvInstallPath', '');

  if (installPath) {
    const nwExe = findNwExe(installPath);
    if (nwExe) return nwExe;
    // Configured path is invalid — fall through to prompt
    vscode.window.showWarningMessage(t('debugger.nwExeNotFound', installPath));
  }

  // Explain what we need before showing the folder picker
  await vscode.window.showInformationMessage(t('debugger.selectInstallFolderPrompt'));

  // Ask user to select the RMMV install folder
  const selected = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: t('debugger.selectInstallFolder'),
    title: t('debugger.selectInstallFolderTitle'),
  });

  if (!selected || selected.length === 0) {
    return undefined;
  }

  const selectedPath = selected[0].fsPath;
  const nwExe = findNwExe(selectedPath);

  if (!nwExe) {
    vscode.window.showErrorMessage(t('debugger.nwExeNotFoundSelected', selectedPath));
    return undefined;
  }

  // Save the path to settings
  await config.update('rmmvInstallPath', selectedPath, vscode.ConfigurationTarget.Global);
  return nwExe;
}

/**
 * Searches for nw.exe in common MV locations within a folder.
 */
function findNwExe(folder: string): string | undefined {
  const candidates = [
    path.join(folder, 'nw.exe'),
    path.join(folder, 'Game.exe'),
    path.join(folder, 'nwjs-win-test', 'game.exe'),  // MV testplay (no embedded package.json)
    path.join(folder, 'nwjs-win-test', 'nw.exe'),
    path.join(folder, 'nwjs-win', 'nw.exe'),
    path.join(folder, 'nwjs-win', 'Game.exe'),        // Deploy-only (has embedded www/ structure)
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

/**
 * Generates launch.json for NW.js debugger attachment.
 */
export async function setupDebugger(workspaceFolder: vscode.WorkspaceFolder): Promise<void> {
  const root = workspaceFolder.uri.fsPath;
  const vscodeDir = path.join(root, '.vscode');
  const launchPath = path.join(vscodeDir, 'launch.json');

  // Ensure .vscode directory exists
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }

  // Resolve the nw.exe path
  const nwExePath = await resolveNwExePath(root);
  if (!nwExePath) {
    return;
  }

  // Check if launch.json already has an nwjs config — update runtimeExecutable if so
  if (fs.existsSync(launchPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(launchPath, 'utf-8'));
      const nwjsLaunch = existing.configurations?.find(
        (c: { type?: string; request?: string; name?: string }) =>
          (c.type === 'chrome' || c.type === 'nwjs' || c.type === 'rmmv') && c.request === 'launch' && c.name?.includes('RMMV')
      );
      if (nwjsLaunch) {
        nwjsLaunch.runtimeExecutable = nwExePath;
        fs.writeFileSync(launchPath, JSON.stringify(existing, null, 2), 'utf-8');
        vscode.window.showInformationMessage(t('debugger.updated'));
        ensureChromiumArgs(root);
        return;
      }
    } catch {
      // Invalid JSON, will overwrite
    }
  }

  const launchConfig = {
    version: '0.2.0',
    configurations: [
      {
        type: 'rmmv',
        request: 'launch',
        name: 'RMMV Testplay (Debug)',
        runtimeExecutable: nwExePath,
        port: 9222,
        webRoot: '${workspaceFolder}',
      },
      {
        type: 'rmmv',
        request: 'attach',
        name: 'Attach to RMMV Testplay',
        port: 9222,
        webRoot: '${workspaceFolder}',
      },
    ],
  };

  // Merge with existing launch.json if present
  if (fs.existsSync(launchPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(launchPath, 'utf-8'));
      if (Array.isArray(existing.configurations)) {
        existing.configurations.push(...launchConfig.configurations);
        fs.writeFileSync(launchPath, JSON.stringify(existing, null, 2), 'utf-8');
        vscode.window.showInformationMessage(t('debugger.addedToExisting'));
        ensureChromiumArgs(root);
        return;
      }
    } catch {
      // Fall through to overwrite
    }
  }

  fs.writeFileSync(launchPath, JSON.stringify(launchConfig, null, 2), 'utf-8');
  vscode.window.showInformationMessage(t('debugger.created'));
  ensureChromiumArgs(root);
}

/**
 * Ensures package.json has the chromium-args for remote debugging.
 */
function ensureChromiumArgs(root: string): void {
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    // MV's package.json has chromium-args at the top level
    const currentArgs: string = pkg['chromium-args'] || '';
    if (!currentArgs.includes('remote-debugging-port')) {
      pkg['chromium-args'] = currentArgs
        ? `${currentArgs} ${CHROMIUM_ARGS}`
        : CHROMIUM_ARGS;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    }
  } catch {
    // Not a JSON file or can't parse
  }
}

/**
 * Removes chromium-args (remote-debugging-port) from package.json
 * to prepare the project for release/distribution.
 */
export async function prepareRelease(workspaceFolder: vscode.WorkspaceFolder): Promise<void> {
  const root = workspaceFolder.uri.fsPath;
  const pkgPath = path.join(root, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    vscode.window.showWarningMessage(t('release.noPackageJson'));
    return;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const currentArgs: string = pkg['chromium-args'] || '';

    if (!currentArgs.includes('remote-debugging-port')) {
      vscode.window.showInformationMessage(t('release.alreadyClean'));
      return;
    }

    // Remove the remote-debugging-port arg
    const cleaned = currentArgs
      .replace(/--remote-debugging-port=\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned) {
      pkg['chromium-args'] = cleaned;
    } else {
      delete pkg['chromium-args'];
    }

    suppressRestoreUntil = Date.now() + 3000; // suppress watcher for 3s
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    vscode.window.showInformationMessage(t('release.done'));
  } catch {
    vscode.window.showErrorMessage(t('release.error'));
  }
}

/**
 * Watches the project's package.json and re-injects chromium-args
 * when RPG Maker MV editor overwrites it.
 */
export function watchPackageJson(
  context: vscode.ExtensionContext,
  workspaceFolder: vscode.WorkspaceFolder
): void {
  const root = workspaceFolder.uri.fsPath;
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  // Only watch if we've previously set up debugging
  const launchPath = path.join(root, '.vscode', 'launch.json');
  if (!fs.existsSync(launchPath)) return;

  try {
    const launch = JSON.parse(fs.readFileSync(launchPath, 'utf-8'));
    const hasNwjs = launch.configurations?.some(
      (c: { type?: string; name?: string }) =>
        (c.type === 'chrome' || c.type === 'nwjs' || c.type === 'rmmv') && c.name?.includes('RMMV')
    );
    if (!hasNwjs) return;
  } catch {
    return;
  }

  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspaceFolder, 'package.json')
  );

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  const onPackageJsonChange = () => {
    // Debounce — MV may write multiple times
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (Date.now() < suppressRestoreUntil) return;
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const currentArgs: string = pkg['chromium-args'] || '';
        if (!currentArgs.includes('remote-debugging-port')) {
          pkg['chromium-args'] = currentArgs
            ? `${currentArgs} ${CHROMIUM_ARGS}`
            : CHROMIUM_ARGS;
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
          vscode.window.showInformationMessage(
            t('debugger.restoredPort')
          );
        }
      } catch {
        // Ignore parse errors during write
      }
    }, 500);
  };

  watcher.onDidChange(onPackageJsonChange);
  watcher.onDidCreate(onPackageJsonChange);
  context.subscriptions.push(watcher);
}
