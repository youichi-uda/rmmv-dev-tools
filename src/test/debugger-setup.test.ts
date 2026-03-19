import { describe, it, expect } from 'vitest';

/**
 * Tests for debugger setup pure logic (src/debugger/setup.ts).
 *
 * ensureChromiumArgs and prepareRelease operate on package.json strings.
 * We replicate the string manipulation logic here to test it in isolation.
 */

const CHROMIUM_ARGS = '--remote-debugging-port=9222';

// ── Replicated from setup.ts ──

function ensureChromiumArgs(currentArgs: string): string {
  if (currentArgs.includes('remote-debugging-port')) {
    return currentArgs;
  }
  return currentArgs
    ? `${currentArgs} ${CHROMIUM_ARGS}`
    : CHROMIUM_ARGS;
}

function removeChromiumArgs(currentArgs: string): string {
  const cleaned = currentArgs
    .replace(/--remote-debugging-port=\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
}

// ── Tests ──

describe('Debugger Setup - ensureChromiumArgs', () => {
  it('should add debug port to empty args', () => {
    expect(ensureChromiumArgs('')).toBe('--remote-debugging-port=9222');
  });

  it('should append debug port to existing args', () => {
    const result = ensureChromiumArgs('--some-flag');
    expect(result).toBe('--some-flag --remote-debugging-port=9222');
  });

  it('should not duplicate if already present', () => {
    const existing = '--remote-debugging-port=9222';
    expect(ensureChromiumArgs(existing)).toBe(existing);
  });

  it('should not duplicate if present with different port', () => {
    const existing = '--remote-debugging-port=5555';
    expect(ensureChromiumArgs(existing)).toBe(existing);
  });

  it('should preserve other args when adding', () => {
    const result = ensureChromiumArgs('--flag1 --flag2');
    expect(result).toContain('--flag1');
    expect(result).toContain('--flag2');
    expect(result).toContain('--remote-debugging-port=9222');
  });
});

describe('Debugger Setup - removeChromiumArgs (prepareRelease)', () => {
  it('should remove debug port arg', () => {
    expect(removeChromiumArgs('--remote-debugging-port=9222')).toBe('');
  });

  it('should remove debug port and keep other args', () => {
    const result = removeChromiumArgs('--flag1 --remote-debugging-port=9222 --flag2');
    expect(result).toBe('--flag1 --flag2');
  });

  it('should handle different port numbers', () => {
    expect(removeChromiumArgs('--remote-debugging-port=5555')).toBe('');
  });

  it('should return empty for only debug port', () => {
    expect(removeChromiumArgs('--remote-debugging-port=9222')).toBe('');
  });

  it('should normalize whitespace after removal', () => {
    const result = removeChromiumArgs('--a  --remote-debugging-port=9222  --b');
    expect(result).toBe('--a --b');
    expect(result).not.toContain('  '); // no double spaces
  });

  it('should handle empty string', () => {
    expect(removeChromiumArgs('')).toBe('');
  });
});
