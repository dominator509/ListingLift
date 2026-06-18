import { DEFAULT_OTHER_SALES_CHANNELS, PHASE_23_REQUIRED_OTHER_SALES_CHANNEL_KEYS, findOtherSalesChannelDefinition } from '@/domain/generic-sales-channels';

export function listOtherSalesChannelCatalog() {
  return DEFAULT_OTHER_SALES_CHANNELS.map((channel) => ({ ...channel, selectableSource: true }));
}

export function getOtherSalesChannelDefinitionOrThrow(channelKeyOrLabel: string) {
  const match = findOtherSalesChannelDefinition(channelKeyOrLabel);
  if (!match) throw new Error(`Unsupported Phase 23 sales channel: ${channelKeyOrLabel}`);
  return match;
}

export function validateOtherSalesChannelCoverage() {
  const present = new Set(DEFAULT_OTHER_SALES_CHANNELS.map((channel) => channel.key));
  return {
    requiredKeys: PHASE_23_REQUIRED_OTHER_SALES_CHANNEL_KEYS,
    missing: PHASE_23_REQUIRED_OTHER_SALES_CHANNEL_KEYS.filter((key) => !present.has(key)),
    count: DEFAULT_OTHER_SALES_CHANNELS.length,
  };
}

export function groupOtherSalesChannelsByCategory() {
  return DEFAULT_OTHER_SALES_CHANNELS.reduce<Record<string, typeof DEFAULT_OTHER_SALES_CHANNELS>>((acc, channel) => {
    acc[channel.category] = acc[channel.category] ?? [];
    acc[channel.category].push(channel);
    return acc;
  }, {});
}
