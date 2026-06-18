import { z } from 'zod';
import type { ImageProviderAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(true) });

export const mockImageProvider: ImageProviderAdapter<typeof configSchema> = {
  key: 'mock-image-provider',
  label: 'Mock Image Provider',
  featureFlag: 'MOCK_IMAGE_PROVIDER_ENABLED',
  secretFields: [],
  supportedOperations: ['remove-background', 'transparent-png', 'white-background', 'resize', 'compress', 'webp', 'metadata-read', 'preview-render'],
  mode: 'mock',
  defaultTimeoutMs: 5000,
  configSchema,
  async healthCheck() {
    return { ok: true, provider: 'mock-image-provider', mode: 'mock', message: 'Mock provider available.', checkedAt: new Date().toISOString() };
  },
  async processImage(request) {
    const preset = request.presetKey ?? 'mock-output';
    const base = request.outputBaseKey.replace(/\/+$/, '');
    const outputStorageKey = `${base}/${preset}.png`;
    return {
      ok: true,
      providerKey: 'mock-image-provider',
      outputStorageKey,
      width: 2000,
      height: 2000,
      mimeType: 'image/png',
      manualFallbackRequired: false,
      outputFiles: [
        {
          outputStorageKey,
          width: 2000,
          height: 2000,
          mimeType: 'image/png',
          outputKind: 'mock-transparent-png',
          metadata: { operations: request.operations, dryRun: request.dryRun ?? false },
        },
      ],
      metadata: { mock: true, originalsPreserved: true },
    };
  },
};
