import { z } from 'zod';
import type { RequiredSalesChannelKey } from '@/domain/database-keys';
import { SALES_CHANNEL_ADAPTER_KEY_BY_CHANNEL, safeMarketplaceAutomationNote } from '@/domain/sales-channel-normalization';
import { normalizeGenericMarketplaceOrder } from '@/server/services/sales-channel-normalizer';
import type { SalesChannelAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(false) });

const manualChannelKeys = [
  'Freelancer',
  'PeoplePerHour',
  'Guru',
  'Contra',
  'Thumbtack',
  'Bark',
  'Houzz',
  'Etsy',
  'Shopify',
  'FacebookMarketplace',
  'FacebookBusinessPage',
  'Instagram',
  'TikTokShop',
  'TikTokProfile',
  'AmazonManual',
  'EbayManual',
  'WooCommerceManual',
  'GoogleBusinessProfile',
  'Craigslist',
  'Nextdoor',
  'Discord',
  'Skool',
  'Circle',
  'LinkedIn',
  'YouTube',
  'XTwitter',
  'Lemon8',
  'Pinterest',
  'ProductHunt',
  'IndieHackers',
  'AppSumo',
  'ChamberOfCommerce',
  'Yelp',
] as const satisfies ReadonlyArray<RequiredSalesChannelKey>;

function labelForChannel(channelKey: RequiredSalesChannelKey) {
  return channelKey.replace(/([a-z])([A-Z])/g, '$1 $2').replace('X Twitter', 'X / Twitter').replace('Ebay', 'eBay');
}

export function createMarketplaceManualAdapter(canonicalChannelKey: (typeof manualChannelKeys)[number]): SalesChannelAdapter<typeof configSchema> {
  const adapterKey = SALES_CHANNEL_ADAPTER_KEY_BY_CHANNEL[canonicalChannelKey];
  const apiCapable = canonicalChannelKey === 'Etsy' || canonicalChannelKey === 'Shopify';
  const csvCapable = canonicalChannelKey === 'AmazonManual' || canonicalChannelKey === 'EbayManual';
  return {
    key: adapterKey,
    canonicalChannelKey,
    label: `${labelForChannel(canonicalChannelKey)} Workflow`,
    featureFlag: `${adapterKey.replaceAll('-', '_').toUpperCase()}_ENABLED`,
    secretFields: apiCapable ? [`${adapterKey.replaceAll('-', '_').toUpperCase()}_TOKEN`] : [],
    supportedModes: apiCapable ? ['API', 'WEBHOOK', 'MANUAL', 'CSV_IMPORT'] : csvCapable ? ['CSV_IMPORT', 'MANUAL'] : ['MANUAL', 'EMAIL_PARSER', 'CSV_IMPORT'],
    marketplaceSafetyRules: [safeMarketplaceAutomationNote(canonicalChannelKey)],
    configSchema,
    async healthCheck() {
      return { ok: true, provider: adapterKey, mode: 'manual', message: 'Manual workflow available. Do not scrape private marketplace pages.' };
    },
    async normalize(input) {
      return normalizeGenericMarketplaceOrder(canonicalChannelKey, (input ?? {}) as Record<string, unknown>);
    },
  };
}

export const marketplaceManualAdapters = manualChannelKeys.map(createMarketplaceManualAdapter);
