import { describe, expect, it } from 'vitest';
import { evaluateSubscriptionEntitlementAccess, buildSubscriptionEntitlementDraft } from '@/server/services/subscription-entitlement-service';

describe('subscription entitlement service', () => {
  it('denies inactive subscription entitlements', () => {
    expect(evaluateSubscriptionEntitlementAccess({ status: 'PAUSED', monthlyImageAllowance: 100, usedThisPeriod: 1 }).allowed).toBe(false);
  });

  it('calculates remaining allowance', () => {
    const draft = buildSubscriptionEntitlementDraft({ organizationId: 'org', entitlementKey: 'monthly-images', monthlyImageAllowance: 100, usedThisPeriod: 25, status: 'ACTIVE' });
    expect(draft.remainingThisPeriod).toBe(75);
  });
});
