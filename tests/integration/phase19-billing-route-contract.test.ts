import { describe, expect, it } from 'vitest';
import { buildManualInvoiceDraft } from '@/server/services/manual-invoice-service';
import { buildManualCreditAdjustmentDraft } from '@/server/services/credit-ledger-service';

describe('phase 19 billing route contract', () => {
  it('keeps manual invoice and credit drafts tenant-scoped', () => {
    const invoice = buildManualInvoiceDraft({ organizationId: 'org_1', invoiceNumber: 'LLINV-TEST', amountCents: 1000, currency: 'USD', creditsIncluded: 0 });
    const credit = buildManualCreditAdjustmentDraft({ organizationId: 'org_1', clientId: 'client_1', amount: 5, reason: 'GOODWILL_CREDIT' });
    expect(invoice.organizationId).toBe('org_1');
    expect(credit.organizationId).toBe('org_1');
  });
});
