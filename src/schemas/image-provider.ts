import { z } from 'zod';
import { IMAGE_PROVIDER_KEYS, IMAGE_PROVIDER_OPERATIONS } from '@/domain/image-providers';

export const imageProviderKeySchema = z.enum(IMAGE_PROVIDER_KEYS);
export const imageProviderOperationSchema = z.enum(IMAGE_PROVIDER_OPERATIONS);

export const imageProviderModeSchema = z.enum(['mock', 'real', 'manual', 'local', 'disabled']);

export const imageProviderHealthSchema = z.object({
  ok: z.boolean(),
  provider: imageProviderKeySchema.or(z.string()),
  mode: imageProviderModeSchema,
  message: z.string(),
  checkedAt: z.string().datetime().optional(),
  code: z.string().optional(),
  manualFallbackRequired: z.boolean().optional(),
});

export const imageProviderErrorSchema = z.object({
  providerKey: z.string(),
  code: z.enum([
    'provider_disabled',
    'real_calls_disabled',
    'missing_secret',
    'rate_limited',
    'timeout',
    'unsupported_operation',
    'invalid_input',
    'upstream_error',
    'unsafe_request',
    'unknown',
  ]),
  message: z.string(),
  retryable: z.boolean().default(false),
  manualFallbackRequired: z.boolean().default(true),
  safeDetails: z.record(z.string(), z.unknown()).optional(),
});

export const imageProviderConfigPatchSchema = z.object({
  providerKey: imageProviderKeySchema,
  enabled: z.boolean(),
  mode: imageProviderModeSchema,
  priority: z.number().int().min(0).max(1000).default(100),
  config: z.record(z.string(), z.unknown()).default({}),
  secretRefs: z.record(z.string(), z.string().min(1)).default({}),
});

export const imageProviderSelectionRequestSchema = z.object({
  preferredProviderKey: imageProviderKeySchema.optional(),
  operations: z.array(imageProviderOperationSchema).min(1),
  allowMock: z.boolean().default(true),
  allowRealProviders: z.boolean().default(false),
  allowManualFallback: z.boolean().default(true),
});

export const imageProviderTestRequestSchema = z.object({
  providerKey: imageProviderKeySchema,
  operations: z.array(imageProviderOperationSchema).min(1).default(['remove-background']),
  inputStorageKey: z.string().min(1).default('demo/originals/demo-product-001.jpg'),
  outputBaseKey: z.string().min(1).default('demo/provider-tests'),
  dryRun: z.boolean().default(true),
});

export const imageProviderSecretSetupSchema = z.object({
  providerKey: imageProviderKeySchema,
  secretRefs: z.record(z.string(), z.string().min(1)),
});

export type ImageProviderConfigPatchInput = z.infer<typeof imageProviderConfigPatchSchema>;
export type ImageProviderSelectionRequest = z.infer<typeof imageProviderSelectionRequestSchema>;
export type ImageProviderTestRequest = z.infer<typeof imageProviderTestRequestSchema>;
export type ImageProviderSecretSetupInput = z.infer<typeof imageProviderSecretSetupSchema>;
