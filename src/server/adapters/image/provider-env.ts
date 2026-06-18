import { IMAGE_PROVIDER_DEFINITION_BY_KEY, type ImageProviderKey } from '@/domain/image-providers';
import { realCallsDisabledError } from '@/server/adapters/image/provider-error-normalizer';
import type { ImageProviderError } from '@/server/adapters/image/types';

export function envFlagEnabled(flagName: string | undefined) {
  if (!flagName) return false;
  return process.env[flagName] === 'true';
}

export function providerFeatureEnabled(providerKey: ImageProviderKey) {
  const definition = IMAGE_PROVIDER_DEFINITION_BY_KEY[providerKey];
  return envFlagEnabled(definition.enabledFeatureFlag);
}

export function realImageProviderCallsEnabled() {
  return process.env.REAL_IMAGE_PROVIDER_CALLS_ENABLED === 'true';
}

export function validateRealProviderRuntime(providerKey: ImageProviderKey): ImageProviderError | null {
  const definition = IMAGE_PROVIDER_DEFINITION_BY_KEY[providerKey];
  if (!definition.realProvider) return null;
  if (!realImageProviderCallsEnabled()) return realCallsDisabledError(providerKey);
  if (!providerFeatureEnabled(providerKey)) {
    return {
      providerKey,
      code: 'provider_disabled',
      message: `${definition.enabledFeatureFlag} is not enabled.`,
      retryable: false,
      manualFallbackRequired: true,
    };
  }
  return null;
}

export function providerRuntimeSummary(providerKey: ImageProviderKey) {
  const definition = IMAGE_PROVIDER_DEFINITION_BY_KEY[providerKey];
  return {
    providerKey,
    enabledFeatureFlag: definition.enabledFeatureFlag,
    enabled: providerFeatureEnabled(providerKey),
    realCallsFeatureFlag: definition.realCallsFeatureFlag ?? null,
    realCallsEnabled: realImageProviderCallsEnabled(),
    mode: definition.defaultMode,
  };
}
