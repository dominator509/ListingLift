import { describe, expect, it } from 'vitest';
import { DEFAULT_IMAGE_PROVIDER_DEFINITIONS } from '@/domain/image-providers';
import { listImageProvidersForAdmin } from '@/server/services/image-provider-registry-service';
import { runImageProviderDryRun } from '@/server/services/image-provider-test-service';

describe('phase 10 image provider route contracts', () => {
  it('admin registry response exposes safe provider metadata only', () => {
    const providers = listImageProvidersForAdmin();
    expect(providers.map((provider) => provider.key).sort()).toEqual(DEFAULT_IMAGE_PROVIDER_DEFINITIONS.map((provider) => provider.key).sort());
    expect(JSON.stringify(providers)).not.toMatch(/api[_-]?key\s*[:=]\s*['\"][^'\"]+/i);
  });

  it('dry-run test does not require paid providers', async () => {
    const result = await runImageProviderDryRun({
      providerKey: 'mock-image-provider',
      operations: ['remove-background'],
      inputStorageKey: 'demo/originals/demo-product.jpg',
      outputBaseKey: 'demo/provider-tests',
      dryRun: true,
    });
    expect(result.ok).toBe(true);
  });
});
