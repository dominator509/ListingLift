import { describe, expect, it } from 'vitest';
import { generateUpsellOfferDrafts } from '../../src/server/services/upsell-engine-service';

describe('generateUpsellOfferDrafts', () => {
  it('recommends retainer for non-subscribed clients', () => {
    const offers = generateUpsellOfferDrafts({
      signal: { organizationId: 'org_1', deliveredImageCount: 30, hasSubscription: false },
      channel: 'CLIENT_DASHBOARD',
    });
    expect(offers.some((offer) => offer.offerType === 'MONTHLY_RETAINER')).toBe(true);
  });
});
