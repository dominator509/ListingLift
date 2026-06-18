import { describe, expect, it } from 'vitest';
import { buildStripePaidEntitlementDraft } from '@/server/services/stripe-entitlement-service';

describe('Stripe failed payment access protection', () => {
  it('does not grant upload or delivery access on failed payments', () => {
    const draft = buildStripePaidEntitlementDraft({ checkoutSessionId: 'cs_failed', paymentStatus: 'FAILED', approvalReady: true });
    expect(draft.mayCreateUploadLink).toBe(false);
    expect(draft.mayExposeDelivery).toBe(false);
  });
});
