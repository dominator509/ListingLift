import { normalizeShopifyStoreDomain } from '@/domain/shopify';

export function createShopifyRevenueAttribution(input: { storeDomain: string; amountCents?: number; currency?: string; productCount?: number }) {
  return {
    sourceChannel: 'Shopify',
    sourceLabel: `Shopify — ${normalizeShopifyStoreDomain(input.storeDomain)}`,
    amountCents: input.amountCents ?? 0,
    currency: input.currency ?? 'USD',
    productCount: input.productCount ?? 0,
    attributionRequired: true,
  };
}
