import { getImageProviderHealthSummary } from '@/server/services/image-provider-registry-service';

export async function getImageProviderReadinessReport() {
  const health = await getImageProviderHealthSummary();
  return {
    ...health,
    readiness: {
      baselineReady: health.providers.some((provider) => provider.key === 'mock-image-provider' && provider.health.ok),
      productionRealProviderReady: health.providers.some((provider) => provider.key !== 'mock-image-provider' && provider.health.ok),
      manualFallbackAvailable: true,
      note: 'Baseline readiness requires the mock provider. Production real-provider readiness requires Codex runtime implementation, encrypted secrets, feature flags, and passing adapter-contract tests.',
    },
  };
}
