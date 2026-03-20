import type { CdpClient } from '../cdp/client';
import type { CdpRemoteObject, CdpPropertyDescriptor, DapVariable } from './protocol';

interface ScopeInfo {
  callFrameId: string;
  scopeNumber: number;
}

/**
 * Manages DAP variablesReference ↔ CDP objectId mapping.
 * Resets on each resume/continue.
 */
export class VariableStore {
  private nextRef = 1;
  /** variablesReference → CDP objectId */
  private refToObjectId = new Map<number, string>();
  /** variablesReference → scope info (only for scope references) */
  private refToScope = new Map<number, ScopeInfo>();

  /** Allocate a variablesReference for a CDP objectId. Returns 0 if not expandable. */
  create(objectId: string | undefined): number {
    if (!objectId) return 0;
    const ref = this.nextRef++;
    this.refToObjectId.set(ref, objectId);
    return ref;
  }

  /** Allocate a variablesReference for a scope (tracks callFrameId + scopeNumber for setVariable). */
  createScope(objectId: string | undefined, callFrameId: string, scopeNumber: number): number {
    if (!objectId) return 0;
    const ref = this.create(objectId);
    this.refToScope.set(ref, { callFrameId, scopeNumber });
    return ref;
  }

  /** Clear all references (call on resume). */
  reset(): void {
    this.refToObjectId.clear();
    this.refToScope.clear();
    this.nextRef = 1;
  }

  /** Fetch variables for a given variablesReference via CDP. */
  async getVariables(cdp: CdpClient, variablesReference: number): Promise<DapVariable[]> {
    const objectId = this.refToObjectId.get(variablesReference);
    if (!objectId) return [];

    const result = await cdp.sendAndWait('Runtime.getProperties', {
      objectId,
      ownProperties: true,
      generatePreview: true,
    }) as { result: CdpPropertyDescriptor[] };

    if (!result?.result) return [];

    return result.result
      .filter(prop => prop.value !== undefined)
      .map(prop => this.propertyToVariable(prop));
  }

  /** Set a variable value. Returns the formatted new value and variablesReference. */
  async setVariable(
    cdp: CdpClient,
    variablesReference: number,
    name: string,
    valueExpression: string,
  ): Promise<{ value: string; type?: string; variablesReference: number }> {
    const scopeInfo = this.refToScope.get(variablesReference);

    if (scopeInfo) {
      return this.setScopeVariable(cdp, scopeInfo, name, valueExpression);
    }

    const objectId = this.refToObjectId.get(variablesReference);
    if (objectId) {
      return this.setObjectProperty(cdp, objectId, name, valueExpression);
    }

    throw new Error('Invalid variablesReference');
  }

  /** Set a scope variable via Debugger.setVariableValue. */
  private async setScopeVariable(
    cdp: CdpClient,
    scope: ScopeInfo,
    name: string,
    valueExpression: string,
  ): Promise<{ value: string; type?: string; variablesReference: number }> {
    // Evaluate the expression to get the new value
    const evalResult = await cdp.sendAndWait('Debugger.evaluateOnCallFrame', {
      callFrameId: scope.callFrameId,
      expression: valueExpression,
      returnByValue: false,
      generatePreview: true,
    }) as { result: CdpRemoteObject; exceptionDetails?: { text: string } };

    if (evalResult.exceptionDetails) {
      throw new Error(evalResult.exceptionDetails.text);
    }

    const newVal = evalResult.result;
    const callArg: Record<string, unknown> = {};
    if (newVal.objectId) {
      callArg.objectId = newVal.objectId;
    } else if (newVal.type === 'undefined') {
      callArg.unserializableValue = 'undefined';
    } else {
      callArg.value = newVal.value;
    }

    await cdp.sendAndWait('Debugger.setVariableValue', {
      scopeNumber: scope.scopeNumber,
      variableName: name,
      newValue: callArg,
      callFrameId: scope.callFrameId,
    });

    return {
      value: formatValue(newVal),
      type: newVal.subtype || newVal.type,
      variablesReference: this.create(newVal.objectId),
    };
  }

  /** Set an object property via Runtime.callFunctionOn. */
  private async setObjectProperty(
    cdp: CdpClient,
    objectId: string,
    name: string,
    valueExpression: string,
  ): Promise<{ value: string; type?: string; variablesReference: number }> {
    // Evaluate expression, then assign to property
    const evalResult = await cdp.sendAndWait('Runtime.evaluate', {
      expression: valueExpression,
      returnByValue: false,
      generatePreview: true,
    }) as { result: CdpRemoteObject; exceptionDetails?: { text: string } };

    if (evalResult.exceptionDetails) {
      throw new Error(evalResult.exceptionDetails.text);
    }

    const newVal = evalResult.result;
    const callArg: Record<string, unknown> = {};
    if (newVal.objectId) {
      callArg.objectId = newVal.objectId;
    } else if (newVal.type === 'undefined') {
      callArg.unserializableValue = 'undefined';
    } else {
      callArg.value = newVal.value;
    }

    await cdp.sendAndWait('Runtime.callFunctionOn', {
      objectId,
      functionDeclaration: 'function(name, val) { this[name] = val; }',
      arguments: [{ value: name }, callArg],
      returnByValue: false,
    });

    return {
      value: formatValue(newVal),
      type: newVal.subtype || newVal.type,
      variablesReference: this.create(newVal.objectId),
    };
  }

  private propertyToVariable(prop: CdpPropertyDescriptor): DapVariable {
    const obj = prop.value!;
    return {
      name: prop.name,
      value: formatValue(obj),
      type: obj.subtype || obj.type,
      variablesReference: this.create(obj.objectId),
    };
  }
}

/** Format a CDP RemoteObject for display in the Variables panel. */
function formatValue(obj: CdpRemoteObject): string {
  if (obj.type === 'undefined') return 'undefined';
  if (obj.type === 'object' && obj.subtype === 'null') return 'null';

  if (obj.type === 'string') return JSON.stringify(obj.value);
  if (obj.type === 'number' || obj.type === 'boolean') return String(obj.value);
  if (obj.type === 'symbol') return obj.description || 'Symbol()';
  if (obj.type === 'function') return obj.description || 'function()';

  // Object with preview
  if (obj.preview) {
    const p = obj.preview;
    if (p.subtype === 'array') {
      return obj.description || `Array(${p.properties.length})`;
    }
    const props = p.properties.map(pp => `${pp.name}: ${pp.value ?? pp.type}`).join(', ');
    const overflow = p.overflow ? ', ...' : '';
    return `${obj.className || 'Object'} {${props}${overflow}}`;
  }

  return obj.description || obj.className || obj.type;
}
