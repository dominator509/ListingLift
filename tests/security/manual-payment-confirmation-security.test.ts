import { describe, expect, it } from 'vitest';
import { buildManualPaymentConfirmationDraft, evaluateManualPaymentConfirmation } from '@/server/services/manual-payment-confirmation-service';

describe('manual payment confirmation security', () => {
  it('redacts payment references in drafts', () => {
    const draft = buildManualPaymentConfirmationDraft({ organizationId: 'org', manualInvoiceId: 'inv', amountCents: 1000, currency: 'USD', applyCredits: false, paymentReference: 'BANK-TRANSFER-SECRET-123456' });
    expect(draft.paymentReferenceRedacted).not.toContain('SECRET');
  });

  it('does not allow void invoice confirmation', () => {
    const result = evaluateManualPaymentConfirmation({ invoiceAmountCents: 1000, existingPaidCents: 0, confirmationAmountCents: 1000, invoiceStatus: 'VOID' });
    expect(result.allowed).toBe(false);
  });
});
