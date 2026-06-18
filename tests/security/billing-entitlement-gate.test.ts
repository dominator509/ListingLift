import { describe, expect, it } from 'vitest';
import { evaluatePaidFulfillmentGate } from '@/server/services/billing-entitlement-service';

describe('billing entitlement gate', () => {
  it('denies failed payment without other verified entitlement', () => {
    expect(evaluatePaidFulfillmentGate({ paymentStatus: 'FAILED', creditBalance: 0 }).allowed).toBe(false);
  });

  it('allows audited manual invoice status', () => {
    expect(evaluatePaidFulfillmentGate({ paymentStatus: 'UNPAID', manualInvoiceStatus: 'PAID' }).allowed).toBe(true);
  });
});
