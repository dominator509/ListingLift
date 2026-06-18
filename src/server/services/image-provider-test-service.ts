import { imageProviderTestRequestSchema, type ImageProviderTestRequest } from '@/schemas/image-provider';
import { getImageProviderStrict } from '@/server/adapters/image/registry';
import { validateRealProviderRuntime } from '@/server/adapters/image/provider-env';

export async function runImageProviderDryRun(input: ImageProviderTestRequest) {
  const data = imageProviderTestRequestSchema.parse(input);
  const adapter = getImageProviderStrict(data.providerKey);
  if (!data.dryRun && adapter.key !== 'mock-image-provider') {
    const runtimeError = validateRealProviderRuntime(adapter.key);
    if (runtimeError) {
      return { ok: false, providerKey: adapter.key, dryRun: data.dryRun, normalizedError: runtimeError, manualFallbackRequired: true };
    }
  }
  if (data.dryRun && adapter.key !== 'mock-image-provider') {
    const health = await adapter.healthCheck();
    return { ok: false, providerKey: adapter.key, dryRun: true, health, message: 'Dry-run only. No real provider call was made.', manualFallbackRequired: !health.ok };
  }
  return adapter.processImage({
    inputStorageKey: data.inputStorageKey,
    outputBaseKey: data.outputBaseKey,
    operations: data.operations,
    dryRun: data.dryRun,
  });
}
