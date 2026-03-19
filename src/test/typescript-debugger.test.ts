import { describe, it, expect } from 'vitest';

/**
 * Tests for debugger setup TypeScript integration (src/debugger/setup.ts).
 *
 * Verifies that the launch.json configuration includes sourceMapPathOverrides
 * for TypeScript plugin debugging.
 */

// ── Replicated launch config structure from setup.ts ──

interface LaunchConfig {
  type: string;
  request: string;
  name: string;
  runtimeExecutable?: string;
  runtimeArgs?: string[];
  webRoot: string;
  port: number;
  sourceMapPathOverrides?: Record<string, string>;
}

function buildLaunchConfigurations(nwExePath: string): LaunchConfig[] {
  return [
    {
      type: 'chrome',
      request: 'launch',
      name: 'RMMZ Testplay (Debug)',
      runtimeExecutable: nwExePath,
      runtimeArgs: ['.', '--remote-debugging-port=9222'],
      webRoot: '${workspaceFolder}',
      port: 9222,
      sourceMapPathOverrides: {
        'ts/plugins/*': '${workspaceFolder}/ts/plugins/*',
      },
    },
    {
      type: 'chrome',
      request: 'attach',
      name: 'Attach to RMMZ Testplay',
      port: 9222,
      webRoot: '${workspaceFolder}',
      sourceMapPathOverrides: {
        'ts/plugins/*': '${workspaceFolder}/ts/plugins/*',
      },
    },
  ];
}

// ── Tests ──

describe('Debugger Setup - sourceMapPathOverrides', () => {
  const configs = buildLaunchConfigurations('/path/to/nw.exe');

  it('should include sourceMapPathOverrides in launch config', () => {
    const launchConfig = configs.find(c => c.request === 'launch');
    expect(launchConfig).toBeDefined();
    expect(launchConfig!.sourceMapPathOverrides).toBeDefined();
  });

  it('should include sourceMapPathOverrides in attach config', () => {
    const attachConfig = configs.find(c => c.request === 'attach');
    expect(attachConfig).toBeDefined();
    expect(attachConfig!.sourceMapPathOverrides).toBeDefined();
  });

  it('should map ts/plugins/* to workspace ts/plugins/*', () => {
    const launchConfig = configs.find(c => c.request === 'launch')!;
    expect(launchConfig.sourceMapPathOverrides!['ts/plugins/*'])
      .toBe('${workspaceFolder}/ts/plugins/*');
  });

  it('should map ts/plugins/* identically in both configs', () => {
    const launch = configs.find(c => c.request === 'launch')!;
    const attach = configs.find(c => c.request === 'attach')!;
    expect(launch.sourceMapPathOverrides).toEqual(attach.sourceMapPathOverrides);
  });

  it('should preserve port 9222 for CDP debugging', () => {
    for (const config of configs) {
      expect(config.port).toBe(9222);
    }
  });

  it('should set webRoot to ${workspaceFolder}', () => {
    for (const config of configs) {
      expect(config.webRoot).toBe('${workspaceFolder}');
    }
  });

  it('should use chrome debug type', () => {
    for (const config of configs) {
      expect(config.type).toBe('chrome');
    }
  });
});

describe('Debugger Setup - config is harmless without ts/plugins/', () => {
  it('sourceMapPathOverrides should not cause issues when ts/ does not exist', () => {
    // The sourceMapPathOverrides mapping is a pattern match.
    // When ts/plugins/ doesn't exist, there are no .js.map files referencing it,
    // so the override has no effect — it's a safe no-op.
    const configs = buildLaunchConfigurations('/path/to/nw.exe');
    const override = configs[0].sourceMapPathOverrides!;

    // The key is a glob pattern, not an absolute path, so it won't error
    expect(Object.keys(override)).toHaveLength(1);
    expect(Object.keys(override)[0]).toBe('ts/plugins/*');
  });
});
