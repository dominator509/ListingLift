import { buildFiverrDedupeKey } from '@/domain/fiverr';

export function buildFiverrRevenueAttributionDraft(input: { orderId: string; gigTitle?: string; amountCents: number; currency?: string; packageKey?: string; deliveredInFiverr?: boolean }) {
  return {
    provider: 'fiverr',
    dedupeKey: buildFiverrDedupeKey(input.orderId),
    channelName: 'Fiverr',
    externalOrderId: input.orderId,
    gigTitle: input.gigTitle,
    amountCents: input.amountCents,
    currency: input.currency ?? 'USD',
    packageKey: input.packageKey,
    deliveredInFiverr: input.deliveredInFiverr ?? false,
    attributionPayload: {
      source: 'Fiverr manual workflow',
      revenueByGig: true,
      marketplaceDeliveryRecordedManually: true,
    },
  };
}
