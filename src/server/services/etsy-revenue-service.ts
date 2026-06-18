import { buildEtsyDedupeKey } from '@/domain/etsy';

export function createEtsyRevenueAttribution(input: { organizationId?: string; orderId: string; shopId?: string; amountCents?: number; currency?: string; listingCount?: number }) {
  return {
    sourceChannel: 'Etsy',
    dedupeKey: buildEtsyDedupeKey({ organizationId: input.organizationId, orderId: input.orderId, shopId: input.shopId }),
    amountCents: input.amountCents ?? 0,
    currency: input.currency ?? 'USD',
    listingCount: input.listingCount ?? 0,
    revenueAttributionRequired: true,
  };
}
