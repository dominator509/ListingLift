import { describe, expect, it } from 'vitest';
import { buildManualInvoiceDraft, evaluateManualInvoiceAccess } from '@/server/services/manual-invoice-service';

describe('manual invoice service', () => {
  it('creates a draft invoice without granting access', () => {
    const draft = buildManualInvoiceDraft({ organizationId: 'org', invoiceNumber: 'LLINV-1', amountCents: 9900, currency: 'USD', creditsIncluded: 0 });
    expect(draft.status).toBe('DRAFT');
    expect(draft.amountCents).toBe(9900);
  });

  it('grants access only when paid or partially paid', () => {
    expect(evaluateManualInvoiceAccess({ status: 'SENT', amountCents: 1000, paidCents: 0 }).grantsAccess).toBe(false);
    expect(evaluateManualInvoiceAccess({ status: 'PAID', amountCents: 1000, paidCents: 1000 }).grantsAccess).toBe(true);
  });
});
