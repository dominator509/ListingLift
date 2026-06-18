import { DEFAULT_IMAGE_PROVIDER_DEFINITIONS, type ImageProviderKey, type ImageProviderOperation } from '@/domain/image-providers';
import { clipdropStyleProvider } from '@/server/adapters/image/clipdrop-style-provider';
import { cloudinaryProvider } from '@/server/adapters/image/cloudinary-provider';
import { localImageWorkerProvider } from '@/server/adapters/image/local-image-worker-provider';
import { mockImageProvider } from '@/server/adapters/image/mock-image-provider';
import { openSourceBackgroundRemovalProvider } from '@/server/adapters/image/open-source-background-removal-provider';
import { providerRuntimeSummary } from '@/server/adapters/image/provider-env';
import { normalizeImageProviderError } from '@/server/adapters/image/provider-error-normalizer';
import { removeBgProvider } from '@/server/adapters/image/remove-bg-provider';
import { replicateProvider } from '@/server/adapters/image/replicate-provider';
import type { ImageProviderAdapter } from '@/server/adapters/image/types';

export const imageProviderAdapters = [
  mockImageProvider,
  removeBgProvider,
  cloudinaryProvider,
  replicateProvider,
  clipdropStyleProvider,
  openSourceBackgroundRemovalProvider,
  localImageWorkerProvider,
] satisfies ImageProviderAdapter[];

export const imageProviderRegistry = Object.fromEntries(imageProviderAdapters.map((adapter) => [adapter.key, adapter])) as unknown as Record<ImageProviderKey, ImageProviderAdapter>;

export function getImageProvider(key: string) {
  return imageProviderRegistry[key as ImageProviderKey] ?? mockImageProvider;
}

export function getImageProviderStrict(key: string) {
  const provider = imageProviderRegistry[key as ImageProviderKey];
  if (!provider) throw new Error(`Unknown image provider: ${key}`);
  return provider;
}

export function listImageProviderRegistry() {
  return DEFAULT_IMAGE_PROVIDER_DEFINITIONS.map((definition) => ({
    ...definition,
    runtime: providerRuntimeSummary(definition.key),
  }));
}

export function findProvidersForOperations(operations: ImageProviderOperation[]) {
  return imageProviderAdapters.filter((adapter) => operations.every((operation) => adapter.supportedOperations.includes(operation)));
}

export function selectImageProviderForOperations(operations: ImageProviderOperation[], preferredProviderKey?: string, allowMock = true) {
  if (preferredProviderKey) {
    const preferred = getImageProvider(preferredProviderKey);
    if (operations.every((operation) => preferred.supportedOperations.includes(operation))) return preferred;
  }
  const candidates = findProvidersForOperations(operations);
  if (!allowMock) return candidates.find((adapter) => adapter.key !== 'mock-image-provider') ?? candidates[0];
  return candidates.find((adapter) => adapter.key === 'mock-image-provider') ?? candidates[0] ?? mockImageProvider;
}

export async function listImageProviderHealth() {
  return Promise.all(
    imageProviderAdapters.map(async (adapter) => {
      try {
        return { key: adapter.key, label: adapter.label, health: await adapter.healthCheck() };
      } catch (error) {
        const normalizedError = adapter.normalizeError?.(error) ?? normalizeImageProviderError(adapter.key, error);
        return {
          key: adapter.key,
          label: adapter.label,
          health: {
            ok: false,
            provider: adapter.key,
            mode: adapter.mode,
            message: normalizedError.message,
            code: normalizedError.code,
            manualFallbackRequired: true,
            checkedAt: new Date().toISOString(),
          },
        };
      }
    }),
  );
}
