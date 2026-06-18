import { describe, expect, it } from 'vitest';
import { imageProviderAdapters } from '@/server/adapters/image/registry';

describe('image provider adapter contract', () => {
  it('requires health checks, processImage, feature flags, and normalized secret metadata', () => {
    for (const adapter of imageProviderAdapters) {
      expect(adapter.key).toBeTruthy();
      expect(adapter.label).toBeTruthy();
      expect(adapter.featureFlag).toBeTruthy();
      expect(Array.isArray(adapter.secretFields)).toBe(true);
      expect(Array.isArray(adapter.supportedOperations)).toBe(true);
      expect(typeof adapter.healthCheck).toBe('function');
      expect(typeof adapter.processImage).toBe('function');
    }
  });

  it('mock provider processes without paid provider keys', async () => {
    const mock = imageProviderAdapters.find((adapter) => adapter.key === 'mock-image-provider');
    expect(mock).toBeTruthy();
    const result = await mock!.processImage({
      inputStorageKey: 'demo/originals/demo-product.jpg',
      outputBaseKey: 'demo/outputs',
      operations: ['remove-background'],
      dryRun: true,
    });
    expect(result.ok).toBe(true);
    expect(result.manualFallbackRequired).toBe(false);
  });
});
