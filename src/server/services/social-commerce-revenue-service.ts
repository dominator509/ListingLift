import { getSocialCommerceChannelDefinition } from '@/domain/social-commerce';

export function createSocialCommerceRevenueSummary(input: { channelKey: string; amountCents?: number; currency?: string; productCount?: number }) {
  const channel = getSocialCommerceChannelDefinition(input.channelKey);
  return {
    sourceChannel: channel.label,
    amountCents: input.amountCents ?? 0,
    currency: input.currency ?? 'USD',
    productCount: input.productCount ?? 0,
    attributionNote: 'Seed revenue attribution only. Codex must persist revenue attribution on ExternalOrder/Job and never derive fulfillment access from client-submitted amount.',
  };
}
