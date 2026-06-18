import { getImageProviderDefinition, redactImageProviderConfig } from '@/domain/image-providers';
import { imageProviderSecretSetupSchema, type ImageProviderSecretSetupInput } from '@/schemas/image-provider';

export function validateImageProviderSecretRefs(input: ImageProviderSecretSetupInput) {
  const data = imageProviderSecretSetupSchema.parse(input);
  const definition = getImageProviderDefinition(data.providerKey);
  if (!definition) throw new Error(`Unknown image provider: ${data.providerKey}`);
  const missing = definition.secretEnvVars.filter((name) => !data.secretRefs[name]);
  return {
    providerKey: data.providerKey,
    requiredSecretNames: definition.secretEnvVars,
    providedSecretNames: Object.keys(data.secretRefs),
    missingSecretNames: missing,
    complete: missing.length === 0,
    secretStorageRule: 'Persist only encrypted secret references. Never store provider API keys in IntegrationConnection.config or send them to the browser.',
  };
}

export function buildImageProviderConnectionDraft(input: {
  organizationId: string;
  providerKey: string;
  enabled: boolean;
  mode: 'MOCK' | 'MANUAL' | 'API' | 'WEBHOOK' | 'EMAIL_PARSER' | 'CSV_IMPORT';
  config?: Record<string, unknown>;
  secretRefs?: Record<string, string>;
}) {
  const definition = getImageProviderDefinition(input.providerKey);
  if (!definition) throw new Error(`Unknown image provider: ${input.providerKey}`);
  return {
    organizationId: input.organizationId,
    providerKey: input.providerKey,
    providerCategory: 'image-processing',
    enabled: input.enabled,
    mode: input.mode,
    config: redactImageProviderConfig({ ...(input.config ?? {}), secretRefs: input.secretRefs ?? {} }),
    secretStatus: validateImageProviderSecretRefs({ providerKey: definition.key, secretRefs: input.secretRefs ?? {} }),
    auditRequired: true,
  };
}
