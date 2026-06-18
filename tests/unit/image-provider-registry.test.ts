import { describe, expect, it } from 'vitest';
import { DEFAULT_IMAGE_PROVIDER_DEFINITIONS, IMAGE_PROVIDER_KEYS } from '@/domain/image-providers';
import { imageProviderAdapters, selectImageProviderForOperations } from '@/server/adapters/image/registry';

describe('image provider registry', () => {
  it('contains every required provider key', () => {
    expect(imageProviderAdapters.map((adapter) => adapter.key).sort()).toEqual([...IMAGE_PROVIDER_KEYS].sort());
  });

  it('keeps the mock provider capable of baseline operations', () => {
    const mock = imageProviderAdapters.find((adapter) => adapter.key === 'mock-image-provider');
    expect(mock?.secretFields).toEqual([]);
    expect(mock?.supportedOperations).toContain('remove-background');
    expect(mock?.supportedOperations).toContain('webp');
  });

  it('selects mock provider by default when allowed', () => {
    const selected = selectImageProviderForOperations(['remove-background'], undefined, true);
    expect(selected.key).toBe('mock-image-provider');
  });

  it('defines feature flags and manual fallback for real providers', () => {
    const realProviders = DEFAULT_IMAGE_PROVIDER_DEFINITIONS.filter((provider) => provider.realProvider);
    expect(realProviders.length).toBeGreaterThan(0);
    expect(realProviders.every((provider) => provider.realCallsFeatureFlag === 'REAL_IMAGE_PROVIDER_CALLS_ENABLED')).toBe(true);
    expect(realProviders.every((provider) => provider.manualFallbackRequiredWhenDisabled)).toBe(true);
  });
});
