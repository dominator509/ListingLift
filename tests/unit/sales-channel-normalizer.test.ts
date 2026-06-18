import { describe, expect, it } from 'vitest';
import { normalizeFiverrOrder, normalizeManualOrder } from '@/server/services/sales-channel-normalizer';

describe('sales channel normalization', () => {
  it('normalizes manual order fields', () => {
    const normalized = normalizeManualOrder({ externalOrderId: 'm-1', buyerName: 'Buyer', packagePurchased: 'QuickCleanup10', amount: '25.00' });
    expect(normalized.channelName).toBe('Direct');
    expect(normalized.orderAmountCents).toBe(2500);
  });

  it('normalizes fiverr order fields without scraping', () => {
    const normalized = normalizeFiverrOrder({ order_id: 'f-1', buyer_username: 'seller123', price: 99, package_key: 'MarketplaceListing25' });
    expect(normalized.channelName).toBe('Fiverr');
    expect(normalized.externalOrderId).toBe('f-1');
  });
});
