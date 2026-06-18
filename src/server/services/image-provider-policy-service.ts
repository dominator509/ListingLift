import { containsPlaintextSecret, getImageProviderDefinition, isImageProviderKey, redactImageProviderConfig } from '@/domain/image-providers';
import { realImageProviderCallsEnabled, providerFeatureEnabled } from '@/server/adapters/image/provider-env';
import type { ImageProviderConfigPatchInput } from '@/schemas/image-provider';

export function validateImageProviderConfigPolicy(input: ImageProviderConfigPatchInput) {
  const definition = getImageProviderDefinition(input.providerKey);
  if (!definition) throw new Error(`Unknown image provider: ${input.providerKey}`);
  if (containsPlaintextSecret(input.config)) {
    throw new Error('Image provider config appears to include plaintext secrets. Store secrets as encrypted references only.');
  }
  const missingRefs = definition.secretEnvVars.filter((name) => !input.secretRefs[name]);
  const realProviderBlocked = definition.realProvider && input.enabled && (!providerFeatureEnabled(definition.key) || !realImageProviderCallsEnabled());
  return {
    ok: missingRefs.length === 0 && !realProviderBlocked,
    providerKey: definition.key,
    enabled: input.enabled,
    mode: input.mode,
    missingSecretRefs: missingRefs,
    realProviderBlocked,
    realProviderBlockedReason: realProviderBlocked
      ? 'Real providers require REAL_IMAGE_PROVIDER_CALLS_ENABLED=true and the provider-specific feature flag. Keep disabled until Codex verifies encrypted secrets and contract tests.'
      : null,
    safeConfig: redactImageProviderConfig(input.config),
  };
}

export function assertKnownImageProvider(providerKey: string) {
  if (!isImageProviderKey(providerKey)) throw new Error(`Unknown image provider: ${providerKey}`);
  return providerKey;
}
