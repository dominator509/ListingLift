import { describe, expect, it } from 'vitest';
import { createEtsyManualOrderPlan } from '@/server/services/etsy-order-intake-service';

describe('Etsy manual order intake service', () => {
  it('creates a normalized Etsy job draft with seller-review guardrails', () => {
    const plan = createEtsyManualOrderPlan({ orderId: '12345', shopName: 'Demo Shop', buyerUsername: 'seller-demo', listingIds: ['listing-1'], listingTitles: ['Handmade mug'], orderAmountCents: 14900, currency: 'USD', orderAmount: 149, useCases: ['SQUARE_LISTING_IMAGE'], deliveryMode: 'ETSY_MESSAGE_WITH_ALLOWED_LINK', externalLinkAllowed: false, uploadStatus: 'WAITING_FOR_UPLOAD', sourceMode: 'MANUAL', dryRun: true });
    expect(plan.channelKey).toBe('Etsy');
    expect(plan.externalOrderDraft.dedupeKey).toContain('etsy');
    expect(plan.jobDraft.targetPlatform).toBe('Etsy');
    expect(plan.jobDraft.selectedPresetKeys).toContain('EtsyListingSquare');
    expect(plan.safety.sellerReviewRequired).toBe(true);
  });
});
