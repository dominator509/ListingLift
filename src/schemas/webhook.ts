import { z } from 'zod';

export const webhookEventCreateSchema = z.object({
  organizationId: z.string().optional(),
  provider: z.string().min(2),
  eventType: z.string().min(2),
  externalId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
});

export type WebhookEventCreateInput = z.infer<typeof webhookEventCreateSchema>;
