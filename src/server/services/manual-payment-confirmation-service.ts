import { redactManualPaymentReference } from '@/domain/credits-subscriptions';
import { manualPaymentConfirmationSchema, type ManualPaymentConfirmationInput } from '@/schemas/credits-subscriptions';

export function buildManualPaymentConfirmationDraft(input: ManualPaymentConfirmationInput & { organizationId: string; confirmedByUserId?: string }) {
  const parsed = manualPaymentConfirmationSchema.parse(input);
  return {
    organizationId: input.organizationId,
    manualInvoiceId: parsed.manualInvoiceId,
    amountCents: parsed.amountCents,
    currency: parsed.currency.toUpperCase(),
    status: 'CONFIRMED' as const,
    confirmedAt: parsed.confirmedAt ? new Date(parsed.confirmedAt) : new Date(),
    confirmedByUserId: input.confirmedByUserId ?? null,
    paymentReferenceRedacted: redactManualPaymentReference(parsed.paymentReference),
    notes: parsed.notes ?? null,
    applyCredits: parsed.applyCredits,
  };
}

export function evaluateManualPaymentConfirmation(input: { invoiceAmountCents: number; existingPaidCents: number; confirmationAmountCents: number; invoiceStatus: string }) {
  if (input.invoiceStatus === 'VOID') return { allowed: false, reason: 'Cannot confirm payment for a void invoice.', newPaidCents: input.existingPaidCents };
  if (input.confirmationAmountCents <= 0) return { allowed: false, reason: 'Payment amount must be positive.', newPaidCents: input.existingPaidCents };
  const newPaidCents = Math.min(input.invoiceAmountCents, input.existingPaidCents + input.confirmationAmountCents);
  return { allowed: true, reason: null, newPaidCents };
}
