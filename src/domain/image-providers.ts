export const IMAGE_PROVIDER_KEYS = [
  'mock-image-provider',
  'remove-bg',
  'cloudinary',
  'replicate',
  'clipdrop-style',
  'open-source-background-removal',
  'local-image-worker',
] as const;

export type ImageProviderKey = (typeof IMAGE_PROVIDER_KEYS)[number];

export const IMAGE_PROVIDER_OPERATIONS = [
  'remove-background',
  'transparent-png',
  'white-background',
  'resize',
  'compress',
  'webp',
  'metadata-read',
  'preview-render',
] as const;

export type ImageProviderOperation = (typeof IMAGE_PROVIDER_OPERATIONS)[number];

export type ImageProviderRuntimeMode = 'mock' | 'real' | 'manual' | 'local' | 'disabled';

export type ImageProviderDefinition = {
  key: ImageProviderKey;
  label: string;
  category: 'mock' | 'background-removal' | 'media-platform' | 'model-api' | 'open-source' | 'worker';
  description: string;
  enabledFeatureFlag: string;
  realCallsFeatureFlag?: string;
  secretEnvVars: string[];
  configFields: string[];
  capabilities: ImageProviderOperation[];
  defaultMode: ImageProviderRuntimeMode;
  realProvider: boolean;
  manualFallbackRequiredWhenDisabled: boolean;
  timeoutMs: number;
  retryCount: number;
  healthCheckSupported: boolean;
  notes: string[];
};

export const DEFAULT_IMAGE_PROVIDER_DEFINITIONS: ImageProviderDefinition[] = [
  {
    key: 'mock-image-provider',
    label: 'Mock Image Provider',
    category: 'mock',
    description: 'Deterministic no-cost provider used for local development, tests, demos, and baseline operation.',
    enabledFeatureFlag: 'MOCK_IMAGE_PROVIDER_ENABLED',
    secretEnvVars: [],
    configFields: ['enabled'],
    capabilities: ['remove-background', 'transparent-png', 'white-background', 'resize', 'compress', 'webp', 'metadata-read', 'preview-render'],
    defaultMode: 'mock',
    realProvider: false,
    manualFallbackRequiredWhenDisabled: false,
    timeoutMs: 5000,
    retryCount: 0,
    healthCheckSupported: true,
    notes: ['Must work without paid API keys.', 'May be disabled in production only after a real provider or manual workflow is configured.'],
  },
  {
    key: 'remove-bg',
    label: 'Remove.bg',
    category: 'background-removal',
    description: 'Real background-removal provider scaffold. Calls remain disabled unless feature flags and encrypted secrets are configured.',
    enabledFeatureFlag: 'REMOVE_BG_ENABLED',
    realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
    secretEnvVars: ['REMOVE_BG_API_KEY'],
    configFields: ['apiKeyRef', 'timeoutMs'],
    capabilities: ['remove-background', 'transparent-png'],
    defaultMode: 'real',
    realProvider: true,
    manualFallbackRequiredWhenDisabled: true,
    timeoutMs: 30000,
    retryCount: 1,
    healthCheckSupported: true,
    notes: ['Do not expose API keys to the frontend.', 'Normalize upstream failures and preserve originals.'],
  },
  {
    key: 'cloudinary',
    label: 'Cloudinary',
    category: 'media-platform',
    description: 'Media transformation provider scaffold for resizing/compression/background workflows where configured.',
    enabledFeatureFlag: 'CLOUDINARY_ENABLED',
    realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
    secretEnvVars: ['CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
    configFields: ['cloudNameRef', 'timeoutMs'],
    capabilities: ['resize', 'compress', 'webp', 'white-background', 'preview-render'],
    defaultMode: 'real',
    realProvider: true,
    manualFallbackRequiredWhenDisabled: true,
    timeoutMs: 30000,
    retryCount: 1,
    healthCheckSupported: true,
    notes: ['Store cloud name as non-secret config only if safe.', 'Store API key and secret as encrypted secret references.'],
  },
  {
    key: 'replicate',
    label: 'Replicate',
    category: 'model-api',
    description: 'Model API provider scaffold for AI background and cleanup workflows where configured.',
    enabledFeatureFlag: 'REPLICATE_ENABLED',
    realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
    secretEnvVars: ['REPLICATE_API_TOKEN'],
    configFields: ['model', 'apiTokenRef', 'timeoutMs'],
    capabilities: ['remove-background', 'transparent-png', 'preview-render'],
    defaultMode: 'real',
    realProvider: true,
    manualFallbackRequiredWhenDisabled: true,
    timeoutMs: 60000,
    retryCount: 1,
    healthCheckSupported: true,
    notes: ['Model IDs are configuration, tokens are secrets.', 'Run with explicit timeout and provider error normalization.'],
  },
  {
    key: 'clipdrop-style',
    label: 'Clipdrop-Style Provider',
    category: 'background-removal',
    description: 'Generic Clipdrop-style background-removal provider scaffold.',
    enabledFeatureFlag: 'CLIPDROP_STYLE_ENABLED',
    realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
    secretEnvVars: ['CLIPDROP_STYLE_API_KEY'],
    configFields: ['endpoint', 'apiKeyRef', 'timeoutMs'],
    capabilities: ['remove-background', 'transparent-png'],
    defaultMode: 'real',
    realProvider: true,
    manualFallbackRequiredWhenDisabled: true,
    timeoutMs: 30000,
    retryCount: 1,
    healthCheckSupported: true,
    notes: ['Endpoint must be allow-listed before runtime use.', 'Do not support arbitrary URL fetching from user input.'],
  },
  {
    key: 'open-source-background-removal',
    label: 'Open-Source Background Removal',
    category: 'open-source',
    description: 'Future open-source provider scaffold for self-hosted background removal.',
    enabledFeatureFlag: 'OPEN_SOURCE_BG_ENABLED',
    realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
    secretEnvVars: [],
    configFields: ['endpoint', 'timeoutMs'],
    capabilities: ['remove-background', 'transparent-png'],
    defaultMode: 'local',
    realProvider: true,
    manualFallbackRequiredWhenDisabled: true,
    timeoutMs: 60000,
    retryCount: 0,
    healthCheckSupported: true,
    notes: ['Future scaffold only.', 'Endpoint must be internal/allow-listed to avoid SSRF.'],
  },
  {
    key: 'local-image-worker',
    label: 'Local Image Worker',
    category: 'worker',
    description: 'Future local worker scaffold for Sharp/open-source processing jobs.',
    enabledFeatureFlag: 'LOCAL_IMAGE_WORKER_ENABLED',
    realCallsFeatureFlag: 'REAL_IMAGE_PROVIDER_CALLS_ENABLED',
    secretEnvVars: [],
    configFields: ['queueName', 'timeoutMs'],
    capabilities: ['resize', 'compress', 'webp', 'white-background', 'metadata-read', 'preview-render'],
    defaultMode: 'local',
    realProvider: false,
    manualFallbackRequiredWhenDisabled: true,
    timeoutMs: 60000,
    retryCount: 0,
    healthCheckSupported: true,
    notes: ['Future worker scaffold only.', 'Do not overwrite originals.'],
  },
];

export const IMAGE_PROVIDER_DEFINITION_BY_KEY = Object.fromEntries(
  DEFAULT_IMAGE_PROVIDER_DEFINITIONS.map((definition) => [definition.key, definition]),
) as Record<ImageProviderKey, ImageProviderDefinition>;

export function getImageProviderDefinition(providerKey: string): ImageProviderDefinition | undefined {
  return DEFAULT_IMAGE_PROVIDER_DEFINITIONS.find((provider) => provider.key === providerKey);
}

export function isImageProviderKey(providerKey: string): providerKey is ImageProviderKey {
  return IMAGE_PROVIDER_KEYS.includes(providerKey as ImageProviderKey);
}

export function providerSupportsOperation(providerKey: ImageProviderKey, operation: ImageProviderOperation) {
  return IMAGE_PROVIDER_DEFINITION_BY_KEY[providerKey].capabilities.includes(operation);
}

export function getProviderSecretEnvVars(providerKey: ImageProviderKey) {
  return IMAGE_PROVIDER_DEFINITION_BY_KEY[providerKey].secretEnvVars;
}

export function getProviderSafeSummary(providerKey: ImageProviderKey) {
  const provider = IMAGE_PROVIDER_DEFINITION_BY_KEY[providerKey];
  return {
    key: provider.key,
    label: provider.label,
    category: provider.category,
    enabledFeatureFlag: provider.enabledFeatureFlag,
    realCallsFeatureFlag: provider.realCallsFeatureFlag ?? null,
    capabilities: provider.capabilities,
    secretEnvVars: provider.secretEnvVars,
    realProvider: provider.realProvider,
    manualFallbackRequiredWhenDisabled: provider.manualFallbackRequiredWhenDisabled,
  };
}

export function redactImageProviderConfig(config: Record<string, unknown> | undefined | null) {
  if (!config) return {};
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    const lower = key.toLowerCase();
    redacted[key] = lower.includes('secret') || lower.includes('token') || lower.includes('key') || lower.includes('password') ? '[redacted]' : value;
  }
  return redacted;
}

export function containsPlaintextSecret(config: Record<string, unknown> | undefined | null) {
  if (!config) return false;
  return Object.entries(config).some(([key, value]) => {
    const lower = key.toLowerCase();
    if (!lower.includes('secret') && !lower.includes('token') && !lower.includes('apikey') && !lower.includes('api_key')) return false;
    return typeof value === 'string' && value.length > 0 && !value.startsWith('secret_ref:') && !value.endsWith('Ref');
  });
}
