import { describe, expect, it } from 'vitest';
import { buildExternalOrderDedupeKey, toCanonicalPackageKey, toCanonicalSalesChannelKey } from '@/domain/sales-channel-normalization';
import { normalizeFiverrOrder, normalizeGumroadOrder, normalizeManualOrder, normalizeStripeCheckoutOrder } from '@/server/services/sales-channel-normalizer';


describe('sales channel normalization', () => {
  it('maps channel aliases to canonical ListingLift channel keys', () => {
    expect(toCanonicalSalesChannelKey('fiverr')).toBe('Fiverr');
    expect(toCanonicalSalesChannelKey('amazon-seller-export')).toBe('AmazonManual');
    expect(toCanonicalSalesChannelKey('facebook marketplace')).toBe('FacebookMarketplace');
  });

  it('maps marketplace package names into canonical package keys', () => {
    expect(toCanonicalPackageKey('Quick Cleanup')).toBe('QuickCleanup10');
    expect(toCanonicalPackageKey('Marketplace Listing')).toBe('MarketplaceListing25');
    expect(toCanonicalPackageKey('white label')).toBe('AgencyWhiteLabel');
  });

  it('normalizes manual orders into the required external order fields', () => {
    const order = normalizeManualOrder({ channelName: 'Direct', externalOrderId: 'ORDER-1', buyerName: 'Demo Buyer', packagePurchased: 'Marketplace Listing', orderAmount: '149.00', paymentStatus: 'paid' });
    expect(order.channelName).toBe('Direct');
    expect(order.externalOrderId).toBe('ORDER-1');
    expect(order.packageKey).toBe('MarketplaceListing25');
    expect(order.orderAmountCents).toBe(14900);
    expect(order.paymentStatus).toBe('PAID');
  });

  it('normalizes Fiverr, Gumroad, and Stripe shapes without using real provider calls', () => {
    expect(normalizeFiverrOrder({ order_id: 'FIV-1', buyer_username: 'demo', gig_title: 'Marketplace Listing', price: 99 }).channelName).toBe('Fiverr');
    expect(normalizeGumroadOrder({ sale_id: 'GUM-1', email: 'buyer@example.com', product_name: 'Quick Cleanup', price_cents: 4900 }).orderAmountCents).toBe(4900);
    expect(normalizeStripeCheckoutOrder({ id: 'cs_test_1', customer_email: 'buyer@example.com', amount_total: 9900, client_reference_id: 'MarketplaceListing25' }).paymentStatus).toBe('PAID');
  });

  it('builds stable dedupe keys from organization, channel, and external order id', () => {
    expect(buildExternalOrderDedupeKey({ organizationId: 'org_1', channelName: 'Fiverr', externalOrderId: 'ABC' })).toBe('org_1:fiverr:abc');
  });
});
