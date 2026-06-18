import { describe, expect, it } from 'vitest';
import { createSocialCommerceCreativePlan } from '@/server/services/social-commerce-creative-plan-service';

describe('social-commerce creative plan service', () => {
  it('keeps creative plan copy compliance-safe', () => {
    const plan = createSocialCommerceCreativePlan({ channelKey: 'tiktok_shop', productNames: ['Bottle'], brandColors: [], formats: [], campaignGoal: 'Launch refresh' });
    expect(plan.safeCopy).toContain('does not guarantee');
    expect(plan.formats.length).toBeGreaterThan(0);
    expect(plan.outputPlan.requireSellerReview).toBe(true);
  });
});
