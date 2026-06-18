import type { NormalizedExternalOrder, RevenueAttributionDraft } from '@/schemas/sales-channel';

export function attributionSourceFromChannelMode(mode?: string): RevenueAttributionDraft['attributionSource'] {
  if (mode === 'WEBHOOK') return 'webhook';
  if (mode === 'API') return 'api';
  if (mode === 'CSV_IMPORT') return 'csv_import';
  if (mode === 'EMAIL_PARSER') return 'email_parser';
  return 'manual';
}

export function buildRevenueAttributionDraft(order: NormalizedExternalOrder, mode?: string): RevenueAttributionDraft {
  return {
    channelName: order.channelName,
    externalOrderId: order.externalOrderId,
    grossAmountCents: order.orderAmountCents ?? 0,
    currency: order.currency,
    packageKey: order.packageKey,
    attributionSource: attributionSourceFromChannelMode(mode),
    sourceUrl: order.sourceUrl,
  };
}

export function summarizeRevenueAttribution(attribution: RevenueAttributionDraft) {
  return {
    label: `${attribution.channelName} · ${attribution.externalOrderId}`,
    grossAmountCents: attribution.grossAmountCents,
    currency: attribution.currency,
    source: attribution.attributionSource,
    hasRevenue: attribution.grossAmountCents > 0,
  };
}
