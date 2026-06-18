import { integrationConnectionSchema, type IntegrationConnectionInput } from '@/schemas/integration';

export function createIntegrationConnectionDraft(input: IntegrationConnectionInput) {
  const data = integrationConnectionSchema.parse(input);
  if (data.enabled && data.mode !== 'MOCK' && process.env.REAL_INTEGRATIONS_ENABLED !== 'true') {
    throw new Error('Real integrations are disabled by environment feature flags.');
  }
  return data;
}
