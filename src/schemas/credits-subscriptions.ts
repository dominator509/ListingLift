import { z } from 'zod';
import { CREDIT_ADJUSTMENT_REASONS, CREDIT_LEDGER_ENTRY_TYPES, MANUAL_INVOICE_STATUSES, SUBSCRIPTION_ENTITLEMENT_STATUSES } from '@/domain/credits-subscriptions';

export const creditLedgerEntryTypeSchema = z.enum(CREDIT_LEDGER_ENTRY_TYPES as [string, ...string[]]);
export const creditAdjustmentReasonSchema = z.enum(CREDIT_ADJUSTMENT_REASONS as [string, ...string[]]);
export const manualInvoiceStatusSchema = z.enum(MANUAL_INVOICE_STATUSES as [string, ...string[]]);
export const subscriptionEntitlementStatusSchema = z.enum(SUBSCRIPTION_ENTITLEMENT_STATUSES as [string, ...string[]]);

export const creditLedgerEntryInputSchema = z.object({
  organizationId: z.string().min(1),
  clientId: z.string().min(1).optional(),
  jobId: z.string().min(1).optional(),
  amount: z.number().int(),
  previousBalance: z.number().int().min(0).default(0),
  entryType: creditLedgerEntryTypeSchema.default('MANUAL_ADJUSTMENT'),
  reason: creditAdjustmentReasonSchema.default('MANUAL_CREDIT_GRANT'),
  source: z.string().min(1).default('manual'),
  sourceReferenceType: z.string().optional(),
  sourceReferenceId: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export const creditAdjustmentInputSchema = z.object({
  clientId: z.string().min(1),
  amount: z.number().int().refine((value) => value !== 0, 'Adjustment amount cannot be zero.'),
  reason: creditAdjustmentReasonSchema,
  notes: z.string().max(1000).optional(),
});

export const creditConsumptionInputSchema = z.object({
  clientId: z.string().min(1),
  jobId: z.string().min(1),
  requestedCredits: z.number().int().positive(),
  availableCredits: z.number().int().min(0),
});

export const manualInvoiceCreateSchema = z.object({
  clientId: z.string().min(1).optional(),
  invoiceNumber: z.string().min(3).max(80),
  amountCents: z.number().int().positive(),
  currency: z.string().length(3).default('USD'),
  creditsIncluded: z.number().int().min(0).default(0),
  packageKey: z.string().optional(),
  dueAt: z.string().datetime().optional(),
  clientNotes: z.string().max(2000).optional(),
  internalNotes: z.string().max(2000).optional(),
});

export const manualPaymentConfirmationSchema = z.object({
  manualInvoiceId: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().length(3).default('USD'),
  paymentReference: z.string().max(200).optional(),
  confirmedAt: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  applyCredits: z.boolean().default(true),
});

export const subscriptionEntitlementInputSchema = z.object({
  clientId: z.string().min(1).optional(),
  subscriptionId: z.string().min(1).optional(),
  entitlementKey: z.string().min(1),
  monthlyImageAllowance: z.number().int().min(0).default(0),
  usedThisPeriod: z.number().int().min(0).default(0),
  status: subscriptionEntitlementStatusSchema.default('ACTIVE'),
  resetsAt: z.string().datetime().optional(),
});

export type CreditLedgerEntryInput = z.infer<typeof creditLedgerEntryInputSchema>;
export type CreditAdjustmentInput = z.infer<typeof creditAdjustmentInputSchema>;
export type CreditConsumptionInput = z.infer<typeof creditConsumptionInputSchema>;
export type ManualInvoiceCreateInput = z.infer<typeof manualInvoiceCreateSchema>;
export type ManualPaymentConfirmationInput = z.infer<typeof manualPaymentConfirmationSchema>;
export type SubscriptionEntitlementInput = z.infer<typeof subscriptionEntitlementInputSchema>;
