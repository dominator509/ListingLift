import { getImageProviderDefinition, getProviderSafeSummary, isImageProviderKey, type ImageProviderKey } from '@/domain/image-providers';
import { listImageProviderHealth, listImageProviderRegistry } from '@/server/adapters/image/registry';

export function listImageProvidersForAdmin() {
  return listImageProviderRegistry().map((provider) => ({
    key: provider.key,
    label: provider.label,
    category: provider.category,
    description: provider.description,
    enabledFeatureFlag: provider.enabledFeatureFlag,
    realCallsFeatureFlag: provider.realCallsFeatureFlag ?? null,
    capabilities: provider.capabilities,
    defaultMode: provider.defaultMode,
    realProvider: provider.realProvider,
    secretEnvVars: provider.secretEnvVars,
    configFields: provider.configFields,
    timeoutMs: provider.timeoutMs,
    retryCount: provider.retryCount,
    manualFallbackRequiredWhenDisabled: provider.manualFallbackRequiredWhenDisabled,
    runtime: provider.runtime,
    notes: provider.notes,
  }));
}

export function getImageProviderAdminDetail(providerKey: string) {
  if (!isImageProviderKey(providerKey)) throw new Error(`Unknown image provider: ${providerKey}`);
  const definition = getImageProviderDefinition(providerKey) ?? getProviderSafeSummary(providerKey as ImageProviderKey);
  return {
    ...definition,
    secretPolicy: {
      secretEnvVars: definition.secretEnvVars,
      storage: 'EncryptedSecret records only. Never return plaintext secret values to the frontend.',
      frontendExposureAllowed: false,
    },
    safetyRules: [
      'Mock provider must work without paid keys.',
      'Real calls require provider-specific flag and REAL_IMAGE_PROVIDER_CALLS_ENABLED=true.',
      'Original uploads must be preserved and never overwritten.',
      'Provider errors must normalize into manual fallback decisions.',
      'Do not fetch arbitrary user-supplied URLs without SSRF controls.',
    ],
  };
}

export async function getImageProviderHealthSummary() {
  const health = await listImageProviderHealth();
  return {
    checkedAt: new Date().toISOString(),
    providers: health,
    summary: {
      total: health.length,
      healthy: health.filter((item) => item.health.ok).length,
      manualFallbackRequired: health.filter((item) => item.health.manualFallbackRequired).length,
    },
  };
}
