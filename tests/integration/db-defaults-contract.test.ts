import { describe, expect, it } from 'vitest';
import { REQUIRED_PACKAGE_KEYS, REQUIRED_PRESET_KEYS, REQUIRED_SALES_CHANNEL_KEYS } from '../../src/domain/database-keys';
import { DEFAULT_PACKAGES, MISSING_DEFAULT_PACKAGE_KEYS } from '../../src/domain/packages';
import { DEFAULT_PLATFORM_PRESETS, MISSING_DEFAULT_PRESET_KEYS } from '../../src/domain/platform-presets';
import { DEFAULT_SALES_CHANNELS, MISSING_DEFAULT_SALES_CHANNEL_KEYS } from '../../src/domain/sales-channels';

describe('phase 2 default database records', () => {
  it('defines every required package key exactly once', () => {
    expect(MISSING_DEFAULT_PACKAGE_KEYS).toEqual([]);
    expect(new Set(DEFAULT_PACKAGES.map((pkg) => pkg.key)).size).toBe(REQUIRED_PACKAGE_KEYS.length);
  });

  it('defines every required platform preset key exactly once', () => {
    expect(MISSING_DEFAULT_PRESET_KEYS).toEqual([]);
    expect(new Set(DEFAULT_PLATFORM_PRESETS.map((preset) => preset.key)).size).toBe(REQUIRED_PRESET_KEYS.length);
  });

  it('defines every required sales channel key exactly once', () => {
    expect(MISSING_DEFAULT_SALES_CHANNEL_KEYS).toEqual([]);
    expect(new Set(DEFAULT_SALES_CHANNELS.map((channel) => channel.key)).size).toBe(REQUIRED_SALES_CHANNEL_KEYS.length);
  });
});
