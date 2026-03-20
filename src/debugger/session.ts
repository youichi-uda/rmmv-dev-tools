import * as child_process from 'child_process';
import { CdpClient, getDebuggerWsUrl } from '../cdp/client';
import { PathMapper } from './pathMapper';
import { VariableStore } from './variableStore';
import {
  THREAD_ID,
  type DapRequest,
  type DapResponse,
  type DapEvent,
  type DapBreakpoint,
  type DapStackFrame,
  type DapScope,
  type CdpCallFrame,
  type CdpPausedEvent,
  type CdpScriptParsed,
  type CdpConsoleApiEvent,
  type CdpBreakpointResolved,
  type CdpRemoteObject,
} from './protocol';

type SendMessage = (message: DapResponse | DapEvent) => void;
type Logger = (msg: string) => void;

/**
 * Core debug session: translates DAP requests ↔ CDP commands.
 * One session per debug attach.
 */
export class RmmvDebugSession {
  private cdp = new CdpClient();
  private pathMapper: PathMapper | undefined;
  private variableStore = new VariableStore();
  private sendMessage: SendMessage;
  private log: Logger;
  private seq = 0;

  /** Current paused call frames (undefined when running). */
  private pausedFrames: CdpCallFrame[] | undefined;

  /** Pending breakpoints set before attach completes. */
  private pendingBreakpoints: Array<{ request: DapRequest }> = [];
  private attached = false;

  /** Spawned game process (launch mode only). */
  private gameProcess: child_process.ChildProcess | undefined;

  /** Track CDP breakpointId → DAP breakpoint id for deferred resolution. */
  private nextBpId = 1;
  private breakpointIdMap = new Map<string, number>();

  constructor(sendMessage: SendMessage, log?: Logger) {
    this.sendMessage = sendMessage;
    this.log = log ?? (() => {});
  }

  // ── Entry point ────────────────────────────────────────────────────────

  async handleRequest(request: DapRequest): Promise<void> {
    try {
      switch (request.command) {
        case 'initialize': return this.onInitialize(request);
        case 'launch': return await this.onLaunch(request);
        case 'attach': return await this.onAttach(request);
        case 'setBreakpoints': return await this.onSetBreakpoints(request);
        case 'setExceptionBreakpoints': return this.respond(request, {});
        case 'threads': return this.onThreads(request);
        case 'stackTrace': return this.onStackTrace(request);
        case 'scopes': return this.onScopes(request);
        case 'variables': return await this.onVariables(request);
        case 'setVariable': return await this.onSetVariable(request);
        case 'evaluate': return await this.onEvaluate(request);
        case 'continue': return await this.onContinue(request);
        case 'next': return await this.onStep(request, 'Debugger.stepOver');
        case 'stepIn': return await this.onStep(request, 'Debugger.stepInto');
        case 'stepOut': return await this.onStep(request, 'Debugger.stepOut');
        case 'pause': return await this.onPause(request);
        case 'disconnect': return await this.onDisconnect(request);
        case 'terminate': return await this.onTerminate(request);
        case 'configurationDone': return this.respond(request, {});
        case 'source': return this.respondError(request, 'Source not available');
        default: return this.respond(request, {});
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.log(`ERROR in ${request.command}: ${msg}`);
      this.respondError(request, msg);
    }
  }

  // ── DAP handlers ───────────────────────────────────────────────────────

  private onInitialize(request: DapRequest): void {
    this.respond(request, {
      supportsConfigurationDoneRequest: true,
      supportsFunctionBreakpoints: false,
      supportsConditionalBreakpoints: false,
      supportsEvaluateForHovers: true,
      supportsStepBack: false,
      supportsSetVariable: true,
      supportsRestartFrame: false,
      supportsGotoTargetsRequest: false,
      supportsCompletionsRequest: false,
      supportsModulesRequest: false,
      supportsExceptionOptions: false,
      supportsExceptionInfoRequest: false,
      supportsTerminateRequest: true,
    });
    this.sendEvent('initialized');
  }

  private async onLaunch(request: DapRequest): Promise<void> {
    const args = request.arguments ?? {};
    const runtimeExecutable = args.runtimeExecutable as string;
    const port = (args.port as number) || 9222;
    const webRoot = (args.webRoot as string) || '.';

    if (!runtimeExecutable) {
      this.respondError(request, 'runtimeExecutable is required for launch');
      return;
    }

    this.pathMapper = new PathMapper(webRoot);
    this.subscribeCdpEvents();

    this.gameProcess = child_process.spawn(runtimeExecutable, [webRoot], {
      cwd: webRoot,
      detached: true,
      stdio: 'ignore',
    });

    this.gameProcess.on('exit', () => {
      this.gameProcess = undefined;
      if (this.cdp.isConnected()) {
        this.cdp.disconnect();
      }
    });

    // Wait for CDP to become available (retry up to 10 seconds)
    let wsUrl: string | undefined;
    for (let attempt = 0; attempt < 40; attempt++) {
      try {
        wsUrl = await getDebuggerWsUrl(port);
        break;
      } catch {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }

    if (!wsUrl) {
      this.gameProcess?.kill();
      this.gameProcess = undefined;
      this.respondError(request, `Game started but CDP not available on port ${port} after 10s`);
      return;
    }

    await this.cdp.connect(wsUrl);

    // Wait for page's execution context before enabling debugger
    // (game scripts load via <script> tags — all parsed before context is created)
    const contextReady = new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 5000); // timeout fallback
      this.cdp.once('Runtime.executionContextCreated', () => {
        clearTimeout(timer);
        resolve();
      });
    });

    await this.cdp.sendAndWait('Debugger.enable', {});
    await this.cdp.sendAndWait('Runtime.enable', {});
    await contextReady;

    this.attached = true;

    for (const pending of this.pendingBreakpoints) {
      await this.onSetBreakpoints(pending.request);
    }
    this.pendingBreakpoints = [];

    this.respond(request, {});
  }

  private async onAttach(request: DapRequest): Promise<void> {
    const args = request.arguments ?? {};
    const port = (args.port as number) || 9222;
    const webRoot = (args.webRoot as string) || '.';

    this.pathMapper = new PathMapper(webRoot);
    this.subscribeCdpEvents();

    // Connect
    const wsUrl = await getDebuggerWsUrl(port);
    await this.cdp.connect(wsUrl);

    // Enable domains
    await this.cdp.sendAndWait('Debugger.enable', {});
    await this.cdp.sendAndWait('Runtime.enable', {});

    this.attached = true;

    // Process any breakpoints that were set before attach
    for (const pending of this.pendingBreakpoints) {
      await this.onSetBreakpoints(pending.request);
    }
    this.pendingBreakpoints = [];

    this.respond(request, {});
  }

  private async onSetBreakpoints(request: DapRequest): Promise<void> {
    if (!this.attached) {
      this.pendingBreakpoints.push({ request });
      return;
    }

    const args = request.arguments ?? {};
    const sourcePath = (args.source as { path?: string })?.path;
    const lines = (args.breakpoints as Array<{ line: number }>) || [];

    if (!sourcePath || !this.pathMapper) {
      this.respond(request, { breakpoints: lines.map(() => ({ verified: false })) });
      return;
    }

    // Resolve source map: .ts → .js path + mapped line
    const isSourceMapped = this.pathMapper.hasSourceMap(sourcePath);
    const breakpoints: DapBreakpoint[] = [];

    for (const bp of lines) {
      try {
        const resolved = this.pathMapper.resolveBreakpointLocation(sourcePath, bp.line - 1); // DAP 1-based → 0-based
        const urlRegex = this.pathMapper.toUrlRegex(resolved.jsPath);

        const result = await this.cdp.sendAndWait('Debugger.setBreakpointByUrl', {
          urlRegex,
          lineNumber: resolved.line, // already 0-based
          columnNumber: 0,
        }) as { breakpointId: string; locations: Array<{ lineNumber: number; columnNumber?: number }> };

        const dapId = this.nextBpId++;
        const hasLocation = result.locations && result.locations.length > 0;

        if (result.breakpointId) {
          this.breakpointIdMap.set(result.breakpointId, dapId);
        }

        // Map back to source line if source-mapped
        let reportedLine = bp.line;
        if (hasLocation && isSourceMapped) {
          const genLine = result.locations[0].lineNumber;
          const genCol = result.locations[0].columnNumber;
          const srcLoc = this.pathMapper.resolveSourceLocation(resolved.jsPath, genLine, genCol);
          reportedLine = srcLoc.line + 1; // 0-based → DAP 1-based
        } else if (hasLocation) {
          reportedLine = result.locations[0].lineNumber + 1;
        }

        breakpoints.push({
          id: dapId,
          verified: hasLocation === true,
          line: reportedLine,
        });
      } catch {
        breakpoints.push({ verified: false, message: 'Failed to set breakpoint' });
      }
    }

    this.respond(request, { breakpoints });
  }

  private onThreads(request: DapRequest): void {
    this.respond(request, {
      threads: [{ id: THREAD_ID, name: 'Main' }],
    });
  }

  private onStackTrace(request: DapRequest): void {
    if (!this.pausedFrames || !this.pathMapper) {
      this.respond(request, { stackFrames: [], totalFrames: 0 });
      return;
    }

    const args = request.arguments ?? {};
    const startFrame = (args.startFrame as number) || 0;
    const levels = (args.levels as number) || this.pausedFrames.length;

    const frames = this.pausedFrames.slice(startFrame, startFrame + levels);

    const stackFrames: DapStackFrame[] = frames.map((cf, i) => {
      const jsPath = this.pathMapper!.urlToLocalPath(cf.url);
      let displayPath = jsPath;
      let line = cf.location.lineNumber;
      let column = cf.location.columnNumber ?? 0;

      // Resolve source map: .js location → .ts location
      if (jsPath) {
        const srcLoc = this.pathMapper!.resolveSourceLocation(jsPath, line, column);
        displayPath = srcLoc.path;
        line = srcLoc.line;
        column = srcLoc.column;
      }

      return {
        id: startFrame + i,
        name: cf.functionName || '(anonymous)',
        source: displayPath ? {
          name: displayPath.split(/[/\\]/).pop(),
          path: displayPath,
        } : undefined,
        line: line + 1,     // 0-based → DAP 1-based
        column: column + 1,
      };
    });

    this.respond(request, { stackFrames, totalFrames: this.pausedFrames.length });
  }

  private onScopes(request: DapRequest): void {
    const frameId = (request.arguments?.frameId as number) ?? 0;

    if (!this.pausedFrames || frameId >= this.pausedFrames.length) {
      this.respond(request, { scopes: [] });
      return;
    }

    const cf = this.pausedFrames[frameId];
    const scopes: DapScope[] = [];

    for (let i = 0; i < cf.scopeChain.length; i++) {
      const scope = cf.scopeChain[i];
      const name = scopeName(scope.type);
      scopes.push({
        name,
        variablesReference: this.variableStore.createScope(scope.object.objectId, cf.callFrameId, i),
        expensive: scope.type === 'global',
      });
    }

    this.respond(request, { scopes });
  }

  private async onVariables(request: DapRequest): Promise<void> {
    const ref = (request.arguments?.variablesReference as number) ?? 0;
    const variables = await this.variableStore.getVariables(this.cdp, ref);
    this.respond(request, { variables });
  }

  private async onSetVariable(request: DapRequest): Promise<void> {
    const args = request.arguments ?? {};
    const variablesReference = (args.variablesReference as number) ?? 0;
    const name = args.name as string;
    const value = args.value as string;

    const result = await this.variableStore.setVariable(this.cdp, variablesReference, name, value);
    this.respond(request, result);
  }

  private async onEvaluate(request: DapRequest): Promise<void> {
    const args = request.arguments ?? {};
    const expression = args.expression as string;
    const frameId = args.frameId as number | undefined;

    let result: { result: CdpRemoteObject; exceptionDetails?: { text: string } };

    if (frameId !== undefined && this.pausedFrames && frameId < this.pausedFrames.length) {
      const callFrameId = this.pausedFrames[frameId].callFrameId;
      result = await this.cdp.sendAndWait('Debugger.evaluateOnCallFrame', {
        callFrameId,
        expression,
        generatePreview: true,
        returnByValue: false,
      }) as typeof result;
    } else {
      result = await this.cdp.sendAndWait('Runtime.evaluate', {
        expression,
        generatePreview: true,
        returnByValue: false,
      }) as typeof result;
    }

    if (result.exceptionDetails) {
      this.respondError(request, result.exceptionDetails.text);
      return;
    }

    const obj = result.result;
    this.respond(request, {
      result: formatEvalResult(obj),
      type: obj.subtype || obj.type,
      variablesReference: this.variableStore.create(obj.objectId),
    });
  }

  private async onContinue(request: DapRequest): Promise<void> {
    await this.cdp.sendAndWait('Debugger.resume', {});
    this.respond(request, { allThreadsContinued: true });
  }

  private async onStep(request: DapRequest, cdpMethod: string): Promise<void> {
    await this.cdp.sendAndWait(cdpMethod, {});
    this.respond(request, {});
  }

  private async onPause(request: DapRequest): Promise<void> {
    await this.cdp.sendAndWait('Debugger.pause', {});
    this.respond(request, {});
  }

  private async onDisconnect(request: DapRequest): Promise<void> {
    const terminateGame = (request.arguments?.terminateDebuggee as boolean) ?? !!this.gameProcess;
    try {
      if (this.cdp.isConnected()) {
        await this.cdp.sendAndWait('Debugger.disable', {}).catch(() => {});
      }
    } finally {
      this.cdp.disconnect();
    }
    if (terminateGame && this.gameProcess) {
      this.gameProcess.kill();
      this.gameProcess = undefined;
    }
    this.respond(request, {});
  }

  private async onTerminate(request: DapRequest): Promise<void> {
    if (this.gameProcess) {
      this.gameProcess.kill();
      this.gameProcess = undefined;
    }
    this.respond(request, {});
  }

  // ── CDP event subscription ────────────────────────────────────────────

  private subscribeCdpEvents(): void {
    this.cdp.on('Debugger.scriptParsed', (params: unknown) => this.onScriptParsed(params as CdpScriptParsed));
    this.cdp.on('Debugger.breakpointResolved', (params: unknown) => this.onBreakpointResolved(params as CdpBreakpointResolved));
    this.cdp.on('Debugger.paused', (params: unknown) => this.onPaused(params as CdpPausedEvent));
    this.cdp.on('Debugger.resumed', () => this.onResumed());
    this.cdp.on('Runtime.consoleAPICalled', (params: unknown) => this.onConsoleApi(params as CdpConsoleApiEvent));
    this.cdp.on('close', () => this.onCdpClose());
  }

  // ── CDP event handlers ─────────────────────────────────────────────────

  private onScriptParsed(params: CdpScriptParsed): void {
    this.pathMapper?.registerScript(params.scriptId, params.url, params.sourceMapURL);
  }

  private onBreakpointResolved(params: CdpBreakpointResolved): void {
    const dapId = this.breakpointIdMap.get(params.breakpointId);
    if (dapId === undefined) return;

    const localPath = this.pathMapper?.getLocalPath(params.location.scriptId);
    this.sendEvent('breakpoint', {
      reason: 'changed',
      breakpoint: {
        id: dapId,
        verified: true,
        line: params.location.lineNumber + 1, // CDP 0-based → DAP 1-based
        source: localPath ? { name: localPath.split(/[/\\]/).pop(), path: localPath } : undefined,
      },
    });
  }

  private onPaused(params: CdpPausedEvent): void {
    this.pausedFrames = params.callFrames;
    this.variableStore.reset();

    let reason: string;
    if (params.reason === 'other') {
      reason = params.hitBreakpoints?.length ? 'breakpoint' : 'pause';
    } else {
      reason = params.reason === 'exception' ? 'exception' : params.reason;
    }

    this.sendEvent('stopped', {
      reason,
      threadId: THREAD_ID,
      allThreadsStopped: true,
    });
  }

  private onResumed(): void {
    this.pausedFrames = undefined;
    this.variableStore.reset();
    this.sendEvent('continued', { threadId: THREAD_ID, allThreadsContinued: true });
  }

  private onConsoleApi(params: CdpConsoleApiEvent): void {
    const output = params.args.map(formatConsoleArg).join(' ') + '\n';
    const category = params.type === 'error' ? 'stderr' :
                     params.type === 'warning' ? 'console' : 'stdout';
    this.sendEvent('output', { category, output });
  }

  private onCdpClose(): void {
    this.sendEvent('terminated');
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  private respond(request: DapRequest, body: Record<string, unknown>): void {
    const response: DapResponse = {
      seq: ++this.seq,
      type: 'response',
      request_seq: request.seq,
      command: request.command,
      success: true,
      body,
    };
    this.sendMessage(response);
  }

  private respondError(request: DapRequest, message: string): void {
    const response: DapResponse = {
      seq: ++this.seq,
      type: 'response',
      request_seq: request.seq,
      command: request.command,
      success: false,
      message,
    };
    this.sendMessage(response);
  }

  private sendEvent(event: string, body?: Record<string, unknown>): void {
    const ev: DapEvent = {
      seq: ++this.seq,
      type: 'event',
      event,
      body,
    };
    this.sendMessage(ev);
  }
}

// ── Utility functions ──────────────────────────────────────────────────

function scopeName(type: string): string {
  switch (type) {
    case 'local': return 'Local';
    case 'closure': return 'Closure';
    case 'global': return 'Global';
    case 'with': return 'With';
    case 'catch': return 'Catch';
    case 'block': return 'Block';
    case 'script': return 'Script';
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

function formatEvalResult(obj: CdpRemoteObject): string {
  if (obj.type === 'undefined') return 'undefined';
  if (obj.type === 'object' && obj.subtype === 'null') return 'null';
  if (obj.type === 'string') return JSON.stringify(obj.value);
  if (obj.type === 'number' || obj.type === 'boolean') return String(obj.value);
  if (obj.description) return obj.description;
  return String(obj.value ?? obj.type);
}

function formatConsoleArg(arg: CdpRemoteObject): string {
  if (arg.type === 'string') return arg.value as string;
  if (arg.type === 'undefined') return 'undefined';
  if (arg.type === 'object' && arg.subtype === 'null') return 'null';
  if (arg.description) return arg.description;
  return JSON.stringify(arg.value ?? arg.type);
}
