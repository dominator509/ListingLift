import { z } from 'zod';
import { validateRealProviderRuntime } from '@/server/adapters/image/provider-env';
import { normalizeImageProviderError } from '@/server/adapters/image/provider-error-normalizer';
import { type ImageProviderAdapter } from '@/server/adapters/image/types';

const configSchema = z.object({ apiKeyRef: z.string().min(1), timeoutMs: z.number().int().positive().default(30000) });

export const removeBgProvider: ImageProviderAdapter<typeof configSchema> = {
  key: 'remove-bg',
  label: 'Remove.bg Provider Scaffold',
  featureFlag: 'REMOVE_BG_ENABLED',
  realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
  secretFields: ['REMOVE_BG_API_KEY'],
  supportedOperations: ['remove-background', 'transparent-png'],
  mode: 'real',
  defaultTimeoutMs: 30000,
  configSchema,
  async healthCheck() {
    const runtimeError = validateRealProviderRuntime('remove-bg');
    if (runtimeError) {
      return { ok: false, provider: 'remove-bg', mode: 'real', message: runtimeError.message, code: runtimeError.code, manualFallbackRequired: true, checkedAt: new Date().toISOString() };
    }
    return { ok: false, provider: 'remove-bg', mode: 'real', message: 'Remove.bg Provider Scaffold real calls are scaffolded. Codex must implement and test runtime calls before enabling production use.', code: 'upstream_error', manualFallbackRequired: true, checkedAt: new Date().toISOString() };
  },
  async processImage(request) {
    const runtimeError = validateRealProviderRuntime('remove-bg');
    if (runtimeError) return { ok: false, providerKey: 'remove-bg', error: runtimeError.message, normalizedError: runtimeError, manualFallbackRequired: true };
    const normalizedError = normalizeImageProviderError('remove-bg', new Error('Remove.bg Provider Scaffold implementation scaffold only. Use mock/manual fallback until Codex implements real API calls.'), { operations: request.operations });
    return { ok: false, providerKey: 'remove-bg', error: normalizedError.message, normalizedError, manualFallbackRequired: true };
  },
  normalizeError(error) {
    return normalizeImageProviderError('remove-bg', error);
  },
};
