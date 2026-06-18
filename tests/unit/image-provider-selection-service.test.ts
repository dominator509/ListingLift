import { describe, expect, it } from 'vitest';
import { selectImageProvider } from '@/server/services/image-provider-selection-service';

describe('image provider selection service', () => {
  it('selects a provider that supports requested operations', () => {
    const result = selectImageProvider({ operations: ['remove-background'], allowMock: true, allowRealProviders: false, allowManualFallback: true });
    expect(result.selectedProviderKey).toBe('mock-image-provider');
    expect(result.supportsAllOperations).toBe(true);
  });

  it('returns a manual-fallback warning for disabled real provider preferences', () => {
    const result = selectImageProvider({ preferredProviderKey: 'remove-bg', operations: ['remove-background'], allowMock: true, allowRealProviders: false, allowManualFallback: true });
    expect(result.selectedProviderKey).toBe('remove-bg');
    expect(result.manualFallbackRequired).toBe(true);
  });
});
