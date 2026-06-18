import { REQUIRED_SALES_CHANNEL_KEYS } from '@/domain/database-keys';
import { SALES_CHANNEL_ADAPTER_KEY_BY_CHANNEL, toCanonicalSalesChannelKey } from '@/domain/sales-channel-normalization';
import { fiverrSalesChannelAdapter } from './fiverr-channel-adapter';
import { gumroadSalesChannelAdapter } from './gumroad-channel-adapter';
import { manualSalesChannelAdapter } from './manual-channel-adapter';
import { marketplaceManualAdapters } from './marketplace-manual-adapters';
import { stripeSalesChannelAdapter } from './stripe-channel-adapter';
import { taskrabbitSalesChannelAdapter } from './taskrabbit-channel-adapter';
import type { SalesChannelAdapterRegistryEntry } from './types';
import { upworkSalesChannelAdapter } from './upwork-channel-adapter';

export const salesChannelAdapters = [
  manualSalesChannelAdapter,
  stripeSalesChannelAdapter,
  fiverrSalesChannelAdapter,
  gumroadSalesChannelAdapter,
  upworkSalesChannelAdapter,
  taskrabbitSalesChannelAdapter,
  ...marketplaceManualAdapters,
];

export const salesChannelAdapterRegistry = Object.fromEntries(salesChannelAdapters.map((adapter) => [adapter.key, adapter]));
export const salesChannelAdapterRegistryByCanonicalKey = Object.fromEntries(salesChannelAdapters.map((adapter) => [adapter.canonicalChannelKey, adapter]));

export function getSalesChannelAdapter(key: string) {
  const direct = salesChannelAdapterRegistry[key];
  if (direct) return direct;
  const canonical = toCanonicalSalesChannelKey(key);
  const adapterKey = SALES_CHANNEL_ADAPTER_KEY_BY_CHANNEL[canonical];
  return salesChannelAdapterRegistry[adapterKey] ?? salesChannelAdapterRegistryByCanonicalKey[canonical] ?? manualSalesChannelAdapter;
}

export function listSalesChannelRegistry(): SalesChannelAdapterRegistryEntry[] {
  return salesChannelAdapters.map((adapter) => ({
    adapterKey: adapter.key,
    canonicalChannelKey: adapter.canonicalChannelKey,
    label: adapter.label,
    supportedModes: adapter.supportedModes,
    featureFlag: adapter.featureFlag,
    secretFields: adapter.secretFields,
    marketplaceSafetyRules: adapter.marketplaceSafetyRules,
  }));
}

export function findMissingRequiredSalesChannelAdapters() {
  const present = new Set(salesChannelAdapters.map((adapter) => adapter.canonicalChannelKey));
  return REQUIRED_SALES_CHANNEL_KEYS.filter((key) => !present.has(key));
}

export async function listSalesChannelAdapterHealth() {
  return Promise.all(
    salesChannelAdapters.map(async (adapter) => ({ key: adapter.key, canonicalChannelKey: adapter.canonicalChannelKey, label: adapter.label, health: await adapter.healthCheck() })),
  );
}
