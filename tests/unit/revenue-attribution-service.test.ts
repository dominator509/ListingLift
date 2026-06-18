import { describe, expect, it } from 'vitest';
import { buildRevenueAttributionDraft, summarizeRevenueAttribution } from '@/server/services/revenue-attribution-service';
import { normalizeManualOrder } from '@/server/services/sales-channel-normalizer';


describe('revenue attribution service', () => {
  it('preserves sales-channel source, amount, currency, and package key', () => {
    const order = normalizeManualOrder({ channelName: 'Fiverr', externalOrderId: 'FIV-1', packagePurchased: 'MarketplaceListing25', orderAmount: 149, currency: 'USD' });
    const attribution = buildRevenueAttributionDraft(order, 'MANUAL');
    expect(attribution.channelName).toBe('Fiverr');
    expect(attribution.grossAmountCents).toBe(14900);
    expect(attribution.packageKey).toBe('MarketplaceListing25');
    expect(summarizeRevenueAttribution(attribution).hasRevenue).toBe(true);
  });
});
