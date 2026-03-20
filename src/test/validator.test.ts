import { describe, it, expect, beforeAll } from 'vitest';
import { DiagnosticSeverity } from 'vscode';
import { validateDocument } from '../annotation/validator';
import { mockDocument } from './helpers';
import { initLocale } from '../i18n';
import { messages as enMessages } from '../messages/en';

beforeAll(() => {
  initLocale(enMessages, enMessages);
});

function diags(content: string) {
  return validateDocument(mockDocument(content));
}

describe('validateDocument', () => {
  // ---- Unknown tag detection ----

  it('warns on unknown tags', () => {
    const d = diags(`/*:
 * @plugindesc My Plugin
 * @target MV
 * @unknownTag foo
 */`);
    const unknown = d.filter(x => x.message.includes('Unknown annotation tag: @unknownTag'));
    expect(unknown).toHaveLength(1);
    expect(unknown[0].severity).toBe(DiagnosticSeverity.Warning);
  });

  // ---- Invalid @type detection ----

  it('warns on invalid @type value', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @param foo
 * @type numbre
 */`);
    const typeWarns = d.filter(x => x.message.includes('Unknown @type'));
    expect(typeWarns).toHaveLength(1);
    expect(typeWarns[0].severity).toBe(DiagnosticSeverity.Warning);
    expect(typeWarns[0].message).toContain('numbre');
  });

  // ---- Valid @type passes ----

  it('does not warn on valid @type values', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @param foo
 * @type number
 */`);
    const typeWarns = d.filter(x => x.message.includes('Unknown @type'));
    expect(typeWarns).toHaveLength(0);
  });

  it('accepts struct<TypeName> as a valid type', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @param foo
 * @type struct<MyStruct>
 */`);
    const typeWarns = d.filter(x => x.message.includes('Unknown @type'));
    expect(typeWarns).toHaveLength(0);
  });

  it('accepts array types (number[])', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @param foo
 * @type number[]
 */`);
    const typeWarns = d.filter(x => x.message.includes('Unknown @type'));
    expect(typeWarns).toHaveLength(0);
  });

  // ---- Scope validation ----

  it('warns when @min is used at top level (outside @param)', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @min 0
 */`);
    const scopeWarns = d.filter(x => x.message.includes('not valid at top level'));
    expect(scopeWarns).toHaveLength(1);
  });

  it('allows @min inside @param scope', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @param myNumber
 * @type number
 * @min 0
 */`);
    const scopeWarns = d.filter(x => x.message.includes('not valid'));
    expect(scopeWarns).toHaveLength(0);
  });

  it('warns when @min is used at top level (after @param resets to top)', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @help Some help text
 * @min 5
 */`);
    const scopeWarns = d.filter(x => x.message.includes('not valid at top level'));
    expect(scopeWarns).toHaveLength(1);
  });

  // ---- Type-specific tag validation ----

  it('hints when @min is used with @type string', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @param foo
 * @type string
 * @min 0
 */`);
    const hints = d.filter(x => x.severity === DiagnosticSeverity.Hint);
    expect(hints).toHaveLength(1);
    expect(hints[0].message).toContain('@min');
    expect(hints[0].message).toContain('string');
  });

  it('does not hint when @min is used with @type number', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @param foo
 * @type number
 * @min 0
 */`);
    const hints = d.filter(x => x.severity === DiagnosticSeverity.Hint);
    expect(hints).toHaveLength(0);
  });

  // ---- Missing @plugindesc detection ----

  it('warns when @plugindesc is missing', () => {
    const d = diags(`/*:
 * @target MV
 * @author Me
 */`);
    const missing = d.filter(x => x.message.includes('@plugindesc is required'));
    expect(missing).toHaveLength(1);
    expect(missing[0].severity).toBe(DiagnosticSeverity.Warning);
  });

  // ---- Missing @target detection ----

  it('reports info when @target is missing', () => {
    const d = diags(`/*:
 * @plugindesc My Plugin
 * @author Me
 */`);
    const missing = d.filter(x => x.message.includes('@target MV is recommended'));
    expect(missing).toHaveLength(1);
    expect(missing[0].severity).toBe(DiagnosticSeverity.Information);
  });

  // ---- Top-level tags reset scope ----

  it('resets scope when a top-level tag appears after @param', () => {
    const d = diags(`/*:
 * @plugindesc Test
 * @target MV
 * @param myParam
 * @type number
 * @help This is help text
 */`);
    // @help is top-level and should not warn
    const helpWarns = d.filter(x => x.message.includes('@help') && x.message.includes('not valid'));
    expect(helpWarns).toHaveLength(0);
  });

  // ---- Struct blocks have limited validation ----

  it('does not validate tag scope inside struct blocks', () => {
    const d = diags(`/*~struct~MyStruct:
 * @param field1
 * @type number
 * @min 0
 * @max 100
 */`);
    // Struct blocks skip scope validation, and also skip missing @plugindesc/@target
    const warns = d.filter(x => x.message.includes('not valid'));
    expect(warns).toHaveLength(0);
    const required = d.filter(x => x.message.includes('@plugindesc') || x.message.includes('@target'));
    expect(required).toHaveLength(0);
  });

  // ---- No diagnostics for valid plugin block ----

  it('produces no warnings for a fully valid block', () => {
    const d = diags(`/*:
 * @plugindesc A fully valid plugin
 * @target MV
 * @author Author
 * @help This plugin does things.
 *
 * @param speed
 * @text Speed
 * @type number
 * @min 1
 * @max 100
 * @default 10
 * @desc How fast it goes.
 */`);
    expect(d).toHaveLength(0);
  });
});
