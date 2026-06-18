import { z } from 'zod';
import { validateRealProviderRuntime } from '@/server/adapters/image/provider-env';
import { normalizeImageProviderError } from '@/server/adapters/image/provider-error-normalizer';
import type { ImageProviderAdapter } from '@/server/adapters/image/types';

const configSchema = z.object({ endpoint: z.string().url().optional(), timeoutMs: z.number().int().positive().default(60000) });

export const openSourceBackgroundRemovalProvider: ImageProviderAdapter<typeof configSchema> = {
  key: 'open-source-background-removal',
  label: 'Open-Source Background Removal Scaffold',
  featureFlag: 'OPEN_SOURCE_BG_ENABLED',
  realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
  secretFields: [],
  supportedOperations: ['remove-background', 'transparent-png'],
  mode: 'local',
  defaultTimeoutMs: 60000,
  configSchema,
  async healthCheck() {
    const runtimeError = validateRealProviderRuntime('open-source-background-removal');
    if (runtimeError) return { ok: false, provider: 'open-source-background-removal', mode: 'local', message: runtimeError.message, code: runtimeError.code, manualFallbackRequired: true, checkedAt: new Date().toISOString() };
    return { ok: false, provider: 'open-source-background-removal', mode: 'local', message: 'Open-source provider scaffold only. Codex must implement worker/service calls before enabling.', code: 'upstream_error', manualFallbackRequired: true, checkedAt: new Date().toISOString() };
  },
  async processImage(request) {
    const runtimeError = validateRealProviderRuntime('open-source-background-removal');
    if (runtimeError) return { ok: false, providerKey: 'open-source-background-removal', error: runtimeError.message, normalizedError: runtimeError, manualFallbackRequired: true };
    const normalizedError = normalizeImageProviderError('open-source-background-removal', new Error('Open-source background removal implementation scaffold only.'), { operations: request.operations });
    return { ok: false, providerKey: 'open-source-background-removal', error: normalizedError.message, normalizedError, manualFallbackRequired: true };
  },
};
