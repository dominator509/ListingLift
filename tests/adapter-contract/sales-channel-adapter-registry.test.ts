import { describe, expect, it } from 'vitest';
import { REQUIRED_SALES_CHANNEL_KEYS } from '@/domain/database-keys';
import { findMissingRequiredSalesChannelAdapters, getSalesChannelAdapter, listSalesChannelRegistry } from '@/server/adapters/sales-channel/registry';


describe('sales channel adapter registry contract', () => {
  it('contains every named ListingLift sales source', () => {
    expect(findMissingRequiredSalesChannelAdapters()).toEqual([]);
    const registry = listSalesChannelRegistry();
    for (const requiredKey of REQUIRED_SALES_CHANNEL_KEYS) {
      expect(registry.some((entry) => entry.canonicalChannelKey === requiredKey)).toBe(true);
    }
  });

  it('resolves aliases to the expected adapter', () => {
    expect(getSalesChannelAdapter('amazon-seller-export').canonicalChannelKey).toBe('AmazonManual');
    expect(getSalesChannelAdapter('stripe').canonicalChannelKey).toBe('Stripe');
    expect(getSalesChannelAdapter('manual').canonicalChannelKey).toBe('Direct');
  });
});
