// ── DAP (Debug Adapter Protocol) types ─────────────────────────────────

/** Single thread ID — NW.js has one JS thread. */
export const THREAD_ID = 1;

export interface DapMessage {
  seq: number;
  type: 'request' | 'response' | 'event';
}

export interface DapRequest extends DapMessage {
  type: 'request';
  command: string;
  arguments?: Record<string, unknown>;
}

export interface DapResponse extends DapMessage {
  type: 'response';
  request_seq: number;
  command: string;
  success: boolean;
  message?: string;
  body?: Record<string, unknown>;
}

export interface DapEvent extends DapMessage {
  type: 'event';
  event: string;
  body?: Record<string, unknown>;
}

// ── DAP sub-types ──────────────────────────────────────────────────────

export interface DapBreakpoint {
  id?: number;
  verified: boolean;
  line?: number;
  source?: DapSource;
  message?: string;
}

export interface DapSource {
  name?: string;
  path?: string;
  sourceReference?: number;
}

export interface DapStackFrame {
  id: number;
  name: string;
  source?: DapSource;
  line: number;
  column: number;
}

export interface DapScope {
  name: string;
  variablesReference: number;
  expensive: boolean;
}

export interface DapVariable {
  name: string;
  value: string;
  type?: string;
  variablesReference: number;
}

// ── CDP (Chrome DevTools Protocol) types ───────────────────────────────

export interface CdpScriptParsed {
  scriptId: string;
  url: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  sourceMapURL?: string;
}

export interface CdpCallFrame {
  callFrameId: string;
  functionName: string;
  location: CdpLocation;
  url: string;
  scopeChain: CdpScope[];
  this: CdpRemoteObject;
}

export interface CdpLocation {
  scriptId: string;
  lineNumber: number;
  columnNumber?: number;
}

export interface CdpScope {
  type: 'global' | 'local' | 'with' | 'closure' | 'catch' | 'block' | 'script' | 'eval' | 'module';
  object: CdpRemoteObject;
  name?: string;
}

export interface CdpRemoteObject {
  type: string;
  subtype?: string;
  className?: string;
  value?: unknown;
  description?: string;
  objectId?: string;
  preview?: CdpObjectPreview;
}

export interface CdpObjectPreview {
  type: string;
  subtype?: string;
  description?: string;
  overflow: boolean;
  properties: CdpPropertyPreview[];
}

export interface CdpPropertyPreview {
  name: string;
  type: string;
  value?: string;
  subtype?: string;
}

export interface CdpPropertyDescriptor {
  name: string;
  value?: CdpRemoteObject;
  get?: CdpRemoteObject;
  set?: CdpRemoteObject;
  configurable: boolean;
  enumerable: boolean;
  wasThrown?: boolean;
  isOwn?: boolean;
}

export interface CdpPausedEvent {
  callFrames: CdpCallFrame[];
  reason: string;
  data?: Record<string, unknown>;
  hitBreakpoints?: string[];
}

export interface CdpBreakpointResolved {
  breakpointId: string;
  location: CdpLocation;
}

export interface CdpConsoleApiEvent {
  type: string;
  args: CdpRemoteObject[];
  timestamp: number;
}
