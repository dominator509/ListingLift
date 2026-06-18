import { z } from 'zod';

export const deliveryLinkCreateSchema = z.object({
  jobId: z.string().min(1),
  expiresInMinutes: z.number().int().positive().max(60 * 24 * 30).default(60 * 24 * 7),
  approvedOnly: z.boolean().default(true),
});

export const deliveryVisibilitySchema = z.object({
  jobStatus: z.string(),
  approvedAt: z.date().nullable().optional(),
  deliveryLinkStatus: z.string(),
  expiresAt: z.date(),
});

export type DeliveryLinkCreateInput = z.infer<typeof deliveryLinkCreateSchema>;
