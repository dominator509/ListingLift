import { z } from 'zod';
import { validateRealProviderRuntime } from '@/server/adapters/image/provider-env';
import { normalizeImageProviderError } from '@/server/adapters/image/provider-error-normalizer';
import { type ImageProviderAdapter } from '@/server/adapters/image/types';

const configSchema = z.object({ endpoint: z.string().url().optional(), apiKeyRef: z.string().optional(), timeoutMs: z.number().int().positive().default(30000) });

export const clipdropStyleProvider: ImageProviderAdapter<typeof configSchema> = {
  key: 'clipdrop-style',
  label: 'Clipdrop-Style Scaffold',
  featureFlag: 'CLIPDROP_STYLE_ENABLED',
  realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
  secretFields: ['CLIPDROP_STYLE_API_KEY'],
  supportedOperations: ['remove-background', 'transparent-png'],
  mode: 'real',
  defaultTimeoutMs: 30000,
  configSchema,
  async healthCheck() {
    const runtimeError = validateRealProviderRuntime('clipdrop-style');
    if (runtimeError) {
      return { ok: false, provider: 'clipdrop-style', mode: 'real', message: runtimeError.message, code: runtimeError.code, manualFallbackRequired: true, checkedAt: new Date().toISOString() };
    }
    return { ok: false, provider: 'clipdrop-style', mode: 'real', message: 'Clipdrop-Style Scaffold real calls are scaffolded. Codex must implement and test runtime calls before enabling production use.', code: 'upstream_error', manualFallbackRequired: true, checkedAt: new Date().toISOString() };
  },
  async processImage(request) {
    const runtimeError = validateRealProviderRuntime('clipdrop-style');
    if (runtimeError) return { ok: false, providerKey: 'clipdrop-style', error: runtimeError.message, normalizedError: runtimeError, manualFallbackRequired: true };
    const normalizedError = normalizeImageProviderError('clipdrop-style', new Error('Clipdrop-Style Scaffold implementation scaffold only. Use mock/manual fallback until Codex implements real API calls.'), { operations: request.operations });
    return { ok: false, providerKey: 'clipdrop-style', error: normalizedError.message, normalizedError, manualFallbackRequired: true };
  },
  normalizeError(error) {
    return normalizeImageProviderError('clipdrop-style', error);
  },
};
