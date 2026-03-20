import * as vscode from 'vscode';
import { RmmvDebugSession } from './session';
import { resolveNwExePath } from './setup';
import type { DapRequest, DapResponse, DapEvent } from './protocol';

/** Shared output channel for debug adapter errors. */
let outputChannel: vscode.OutputChannel | undefined;

function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('RMMV Debug Adapter');
  }
  return outputChannel;
}

/**
 * Inline Debug Adapter for RPG Maker MV (NW.js / Chrome 65).
 * Bypasses js-debug's Target.attachToBrowserTarget requirement
 * by connecting directly to the page's CDP WebSocket.
 */
export class RmmvDebugAdapter implements vscode.DebugAdapter {
  private sendMessageEmitter = new vscode.EventEmitter<vscode.DebugProtocolMessage>();
  readonly onDidSendMessage: vscode.Event<vscode.DebugProtocolMessage> = this.sendMessageEmitter.event;

  private session: RmmvDebugSession;

  constructor() {
    const ch = getOutputChannel();

    this.session = new RmmvDebugSession(
      (message: DapResponse | DapEvent) => {
        this.sendMessageEmitter.fire(message as unknown as vscode.DebugProtocolMessage);
      },
      (msg: string) => {
        ch.appendLine(msg);
      }
    );
  }

  handleMessage(message: vscode.DebugProtocolMessage): void {
    const request = message as unknown as DapRequest;
    if (request.type === 'request') {
      this.session.handleRequest(request);
    }
  }

  dispose(): void {
    this.sendMessageEmitter.dispose();
  }
}

/**
 * Factory registered with VS Code to create the inline debug adapter.
 */
export class RmmvDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {
  createDebugAdapterDescriptor(
    _session: vscode.DebugSession,
    _executable: vscode.DebugAdapterExecutable | undefined
  ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    return new vscode.DebugAdapterInlineImplementation(new RmmvDebugAdapter());
  }
}

/**
 * Resolves runtimeExecutable before launch if not specified.
 * Checks project root → rmmv.rmmvInstallPath setting → prompts user.
 */
export class RmmvDebugConfigProvider implements vscode.DebugConfigurationProvider {
  resolveDebugConfiguration(
    folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration,
    _token?: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DebugConfiguration> {
    // Fill defaults for empty config (F5 with no launch.json)
    if (!config.type) {
      config.type = 'rmmv';
      config.request = 'launch';
      config.name = 'RMMV Testplay (Debug)';
    }

    config.webRoot = config.webRoot || folder?.uri.fsPath || '${workspaceFolder}';
    config.port = config.port || 9222;

    if (config.request === 'launch' && !config.runtimeExecutable) {
      // Return a Thenable — VS Code will await it
      return resolveNwExePath(folder?.uri.fsPath).then(exePath => {
        if (!exePath) return undefined; // Cancel launch
        config.runtimeExecutable = exePath;
        return config;
      });
    }

    return config;
  }
}
