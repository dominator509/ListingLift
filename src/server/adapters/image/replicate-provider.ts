import { z } from 'zod';
import { validateRealProviderRuntime } from '@/server/adapters/image/provider-env';
import { normalizeImageProviderError } from '@/server/adapters/image/provider-error-normalizer';
import { type ImageProviderAdapter } from '@/server/adapters/image/types';

const configSchema = z.object({ model: z.string().optional(), apiTokenRef: z.string().optional(), timeoutMs: z.number().int().positive().default(60000) });

export const replicateProvider: ImageProviderAdapter<typeof configSchema> = {
  key: 'replicate',
  label: 'Replicate Scaffold',
  featureFlag: 'REPLICATE_ENABLED',
  realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
  secretFields: ['REPLICATE_API_TOKEN'],
  supportedOperations: ['remove-background', 'transparent-png', 'preview-render'],
  mode: 'real',
  defaultTimeoutMs: 60000,
  configSchema,
  async healthCheck() {
    const runtimeError = validateRealProviderRuntime('replicate');
    if (runtimeError) {
      return { ok: false, provider: 'replicate', mode: 'real', message: runtimeError.message, code: runtimeError.code, manualFallbackRequired: true, checkedAt: new Date().toISOString() };
    }
    return { ok: false, provider: 'replicate', mode: 'real', message: 'Replicate Scaffold real calls are scaffolded. Codex must implement and test runtime calls before enabling production use.', code: 'upstream_error', manualFallbackRequired: true, checkedAt: new Date().toISOString() };
  },
  async processImage(request) {
    const runtimeError = validateRealProviderRuntime('replicate');
    if (runtimeError) return { ok: false, providerKey: 'replicate', error: runtimeError.message, normalizedError: runtimeError, manualFallbackRequired: true };
    const normalizedError = normalizeImageProviderError('replicate', new Error('Replicate Scaffold implementation scaffold only. Use mock/manual fallback until Codex implements real API calls.'), { operations: request.operations });
    return { ok: false, providerKey: 'replicate', error: normalizedError.message, normalizedError, manualFallbackRequired: true };
  },
  normalizeError(error) {
    return normalizeImageProviderError('replicate', error);
  },
};
