import { z } from 'zod';
import { validateRealProviderRuntime } from '@/server/adapters/image/provider-env';
import { normalizeImageProviderError } from '@/server/adapters/image/provider-error-normalizer';
import { type ImageProviderAdapter } from '@/server/adapters/image/types';

const configSchema = z.object({ cloudNameRef: z.string().optional(), apiKeyRef: z.string().optional(), apiSecretRef: z.string().optional(), timeoutMs: z.number().int().positive().default(30000) });

export const cloudinaryProvider: ImageProviderAdapter<typeof configSchema> = {
  key: 'cloudinary',
  label: 'Cloudinary Scaffold',
  featureFlag: 'CLOUDINARY_ENABLED',
  realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
  secretFields: ['CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
  supportedOperations: ['resize', 'compress', 'webp', 'white-background', 'preview-render'],
  mode: 'real',
  defaultTimeoutMs: 30000,
  configSchema,
  async healthCheck() {
    const runtimeError = validateRealProviderRuntime('cloudinary');
    if (runtimeError) {
      return { ok: false, provider: 'cloudinary', mode: 'real', message: runtimeError.message, code: runtimeError.code, manualFallbackRequired: true, checkedAt: new Date().toISOString() };
    }
    return { ok: false, provider: 'cloudinary', mode: 'real', message: 'Cloudinary Scaffold real calls are scaffolded. Codex must implement and test runtime calls before enabling production use.', code: 'upstream_error', manualFallbackRequired: true, checkedAt: new Date().toISOString() };
  },
  async processImage(request) {
    const runtimeError = validateRealProviderRuntime('cloudinary');
    if (runtimeError) return { ok: false, providerKey: 'cloudinary', error: runtimeError.message, normalizedError: runtimeError, manualFallbackRequired: true };
    const normalizedError = normalizeImageProviderError('cloudinary', new Error('Cloudinary Scaffold implementation scaffold only. Use mock/manual fallback until Codex implements real API calls.'), { operations: request.operations });
    return { ok: false, providerKey: 'cloudinary', error: normalizedError.message, normalizedError, manualFallbackRequired: true };
  },
  normalizeError(error) {
    return normalizeImageProviderError('cloudinary', error);
  },
};
