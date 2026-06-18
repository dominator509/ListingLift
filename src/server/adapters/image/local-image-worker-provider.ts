import { z } from 'zod';
import { validateRealProviderRuntime } from '@/server/adapters/image/provider-env';
import { normalizeImageProviderError } from '@/server/adapters/image/provider-error-normalizer';
import type { ImageProviderAdapter } from '@/server/adapters/image/types';

const configSchema = z.object({ queueName: z.string().optional(), timeoutMs: z.number().int().positive().default(60000) });

export const localImageWorkerProvider: ImageProviderAdapter<typeof configSchema> = {
  key: 'local-image-worker',
  label: 'Local Image Worker Scaffold',
  featureFlag: 'LOCAL_IMAGE_WORKER_ENABLED',
  realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
  secretFields: [],
  supportedOperations: ['resize', 'compress', 'webp', 'white-background', 'metadata-read', 'preview-render'],
  mode: 'local',
  defaultTimeoutMs: 60000,
  configSchema,
  async healthCheck() {
    const runtimeError = validateRealProviderRuntime('local-image-worker');
    if (runtimeError) return { ok: false, provider: 'local-image-worker', mode: 'local', message: runtimeError.message, code: runtimeError.code, manualFallbackRequired: true, checkedAt: new Date().toISOString() };
    return { ok: false, provider: 'local-image-worker', mode: 'local', message: 'Local worker scaffold only. Codex must implement queue/worker runtime before enabling.', code: 'upstream_error', manualFallbackRequired: true, checkedAt: new Date().toISOString() };
  },
  async processImage(request) {
    const runtimeError = validateRealProviderRuntime('local-image-worker');
    if (runtimeError) return { ok: false, providerKey: 'local-image-worker', error: runtimeError.message, normalizedError: runtimeError, manualFallbackRequired: true };
    const normalizedError = normalizeImageProviderError('local-image-worker', new Error('Local image worker implementation scaffold only.'), { operations: request.operations });
    return { ok: false, providerKey: 'local-image-worker', error: normalizedError.message, normalizedError, manualFallbackRequired: true };
  },
};
