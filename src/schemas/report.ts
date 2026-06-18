import { z } from 'zod';

export const reportCreateSchema = z.object({
  organizationId: z.string().min(1),
  jobId: z.string().optional(),
  title: z.string().min(3),
  body: z.string().min(10),
});

export const upsellOfferSchema = z.object({
  organizationId: z.string().min(1),
  jobId: z.string().optional(),
  title: z.string().min(3),
  body: z.string().min(10),
  cta: z.string().min(2),
  status: z.enum(['draft', 'sent', 'accepted', 'declined']).default('draft'),
});

export type ReportCreateInput = z.infer<typeof reportCreateSchema>;
export type UpsellOfferInput = z.infer<typeof upsellOfferSchema>;
