import { describe, expect, it } from 'vitest';
import { createStripePaidJobIntakePlan } from '@/server/services/stripe-billing-orchestrator';

describe('Phase 17 Stripe route contract seed', () => {
  it('plans paid job intake without granting access before payment', () => {
    const plan = createStripePaidJobIntakePlan({ packageKey: 'QuickCleanup10', purpose: 'PACKAGE', quantity: 1, metadata: {} });
    expect(plan.grantsAccessBeforePayment).toBe(false);
    expect(plan.triggersUploadLinkAfterPayment).toBe(true);
  });
});
