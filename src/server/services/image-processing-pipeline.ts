import { getImageProvider } from '@/server/adapters/image/registry';
import { type ImageProcessingRequest } from '@/server/adapters/image/types';

export async function processImageWithProvider(input: ImageProcessingRequest, providerKey = 'mock-image-provider') {
  const provider = getImageProvider(providerKey);
  if (!provider) throw new Error(`Unknown image provider: ${providerKey}`);
  return provider.processImage(input);
}

export async function processImageBatch(inputs: ImageProcessingRequest[], providerKey = 'mock-image-provider') {
  const results = [];
  for (const input of inputs) {
    try {
      results.push(await processImageWithProvider(input, providerKey));
    } catch (error) {
      results.push({
        ok: false,
        providerKey,
        error: error instanceof Error ? error.message : 'Unknown error',
        manualFallbackRequired: true,
      });
    }
  }
  return {
    results,
    summary: {
      total: results.length,
      ok: results.filter((result) => result.ok).length,
      failed: results.filter((result) => !result.ok).length,
      manualFallbackRequired: results.some((result) => result.manualFallbackRequired),
    },
  };
}
