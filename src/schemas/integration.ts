import { z } from 'zod';

export const integrationModeSchema = z.enum(['MOCK', 'MANUAL', 'API', 'WEBHOOK', 'EMAIL_PARSER', 'CSV_IMPORT']);

export const integrationConnectionSchema = z.object({
  organizationId: z.string().min(1),
  providerKey: z.string().min(2),
  mode: integrationModeSchema.default('MOCK'),
  enabled: z.boolean().default(false),
  config: z.record(z.string(), z.unknown()).optional(),
});

export type IntegrationConnectionInput = z.infer<typeof integrationConnectionSchema>;
