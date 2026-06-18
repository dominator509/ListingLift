import { DEFAULT_OTHER_SALES_CHANNELS } from '@/domain/generic-sales-channels';

export function summarizeGenericChannelRevenue(rows: Array<{ channelKey: string; amountCents?: number; currency?: string }>) {
  const summary = new Map<string, { channelKey: string; label: string; amountCents: number; count: number; currency: string }>();
  for (const channel of DEFAULT_OTHER_SALES_CHANNELS) {
    summary.set(channel.key, { channelKey: channel.key, label: channel.label, amountCents: 0, count: 0, currency: 'USD' });
  }
  for (const row of rows) {
    const existing = summary.get(row.channelKey) ?? { channelKey: row.channelKey, label: row.channelKey, amountCents: 0, count: 0, currency: row.currency ?? 'USD' };
    existing.amountCents += row.amountCents ?? 0;
    existing.count += 1;
    existing.currency = row.currency ?? existing.currency;
    summary.set(row.channelKey, existing);
  }
  return Array.from(summary.values()).sort((a, b) => b.amountCents - a.amountCents || a.label.localeCompare(b.label));
}

export function buildGenericChannelRevenueAttribution(input: { channelKey: string; externalReference: string; amountCents?: number; currency?: string; sourceUrl?: string }) {
  return {
    sourceChannel: input.channelKey,
    externalReference: input.externalReference,
    amountCents: input.amountCents ?? 0,
    currency: input.currency ?? 'USD',
    sourceUrl: input.sourceUrl,
    attributionRequired: true,
    manualVerificationRequired: true,
  };
}
