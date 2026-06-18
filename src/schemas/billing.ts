import { z } from 'zod';

export const creditAdjustmentSchema = z.object({
  organizationId: z.string().min(1),
  clientId: z.string().optional(),
  jobId: z.string().optional(),
  amount: z.number().int(),
  reason: z.string().min(3),
});

export const invoicePaymentSchema = z.object({
  organizationId: z.string().min(1),
  provider: z.string().min(2),
  externalId: z.string().optional(),
  amountCents: z.number().int().nonnegative(),
  currency: z.string().length(3).default('USD'),
  status: z.enum(['UNPAID', 'PENDING', 'PAID', 'REFUNDED', 'FAILED', 'MANUAL_CONFIRMED']).default('PENDING'),
});

export type CreditAdjustmentInput = z.infer<typeof creditAdjustmentSchema>;
export type InvoicePaymentInput = z.infer<typeof invoicePaymentSchema>;
