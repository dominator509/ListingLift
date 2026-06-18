import { REQUIRED_PACKAGE_KEYS, REQUIRED_SALES_CHANNEL_KEYS, type RequiredPackageKey, type RequiredSalesChannelKey } from './database-keys';
import { DEFAULT_PACKAGES } from './packages';
import { DEFAULT_SALES_CHANNELS, type IntegrationMode, type SalesChannelDefinition } from './sales-channels';

export const NORMALIZED_SALES_CHANNEL_FIELDS = [
  'channelName',
  'externalOrderId',
  'externalCustomerId',
  'buyerName',
  'buyerEmailOrUsername',
  'packagePurchased',
  'orderAmount',
  'currency',
  'deadline',
  'revisionAllowance',
  'sourceUrl',
  'paymentStatus',
  'uploadStatus',
  'fulfillmentStatus',
  'internalClientId',
  'internalJobId',
] as const;

export type NormalizedSalesChannelField = (typeof NORMALIZED_SALES_CHANNEL_FIELDS)[number];

export const SALES_CHANNEL_ADAPTER_ALIASES: Record<string, RequiredSalesChannelKey> = {
  direct: 'Direct',
  website: 'Direct',
  manual: 'Direct',
  stripe: 'Stripe',
  'stripe-checkout': 'Stripe',
  gumroad: 'Gumroad',
  fiverr: 'Fiverr',
  upwork: 'Upwork',
  taskrabbit: 'Taskrabbit',
  freelancer: 'Freelancer',
  'freelancer-com': 'Freelancer',
  peopleperhour: 'PeoplePerHour',
  'people-per-hour': 'PeoplePerHour',
  guru: 'Guru',
  contra: 'Contra',
  thumbtack: 'Thumbtack',
  bark: 'Bark',
  houzz: 'Houzz',
  etsy: 'Etsy',
  shopify: 'Shopify',
  facebook: 'FacebookMarketplace',
  'facebook-marketplace': 'FacebookMarketplace',
  'facebook-business-page': 'FacebookBusinessPage',
  'facebook-page': 'FacebookBusinessPage',
  instagram: 'Instagram',
  tiktok: 'TikTokShop',
  'tiktok-shop': 'TikTokShop',
  'tiktok-profile': 'TikTokProfile',
  'tiktok-bio': 'TikTokProfile',
  amazon: 'AmazonManual',
  'amazon-manual': 'AmazonManual',
  'amazon-seller-export': 'AmazonManual',
  ebay: 'EbayManual',
  'ebay-export': 'EbayManual',
  woocommerce: 'Shopify',
  'google-business-profile': 'GoogleBusinessProfile',
  craigslist: 'Craigslist',
  nextdoor: 'Nextdoor',
  discord: 'Discord',
  skool: 'Skool',
  circle: 'Circle',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'XTwitter',
  twitter: 'XTwitter',
  'x-twitter': 'XTwitter',
  lemon8: 'Lemon8',
  pinterest: 'Pinterest',
  producthunt: 'ProductHunt',
  'product-hunt': 'ProductHunt',
  indiehackers: 'IndieHackers',
  'indie-hackers': 'IndieHackers',
  appsumo: 'AppSumo',
  'chamber-of-commerce': 'ChamberOfCommerce',
  yelp: 'Yelp',
};

export const SALES_CHANNEL_ADAPTER_KEY_BY_CHANNEL: Record<RequiredSalesChannelKey, string> = {
  Direct: 'manual',
  Stripe: 'stripe',
  Gumroad: 'gumroad',
  Fiverr: 'fiverr',
  Upwork: 'upwork',
  Taskrabbit: 'taskrabbit',
  Freelancer: 'freelancer',
  PeoplePerHour: 'peopleperhour',
  Guru: 'guru',
  Contra: 'contra',
  Thumbtack: 'thumbtack',
  Bark: 'bark',
  Houzz: 'houzz',
  Etsy: 'etsy',
  Shopify: 'shopify',
  WooCommerceManual: 'woocommerce-manual',
  FacebookMarketplace: 'facebook-marketplace',
  FacebookBusinessPage: 'facebook-business-page',
  Instagram: 'instagram',
  TikTokShop: 'tiktok-shop',
  TikTokProfile: 'tiktok-profile',
  AmazonManual: 'amazon-seller-export',
  EbayManual: 'ebay-export',
  GoogleBusinessProfile: 'google-business-profile',
  Craigslist: 'craigslist',
  Nextdoor: 'nextdoor',
  Discord: 'discord',
  Skool: 'skool',
  Circle: 'circle',
  LinkedIn: 'linkedin',
  YouTube: 'youtube',
  XTwitter: 'x-twitter',
  Lemon8: 'lemon8',
  Pinterest: 'pinterest',
  ProductHunt: 'product-hunt',
  IndieHackers: 'indie-hackers',
  AppSumo: 'appsumo',
  ChamberOfCommerce: 'chamber-of-commerce',
  Yelp: 'yelp',
};

export const SALES_CHANNEL_IMPORT_MODES: IntegrationMode[] = ['API', 'WEBHOOK', 'EMAIL_PARSER', 'MANUAL', 'CSV_IMPORT'];

const packageAliasEntries: Array<[string, RequiredPackageKey]> = [
  ['quick cleanup', 'QuickCleanup10'],
  ['quick-cleanup', 'QuickCleanup10'],
  ['quick_cleanup', 'QuickCleanup10'],
  ['cleanup 10', 'QuickCleanup10'],
  ['10 images', 'QuickCleanup10'],
  ['marketplace listing 25', 'MarketplaceListing25'],
  ['marketplace listing', 'MarketplaceListing25'],
  ['marketplace pack', 'MarketplaceListing25'],
  ['listing pack', 'MarketplaceListing25'],
  ['marketplace listing 50', 'MarketplaceListing50'],
  ['product launch 50', 'ProductLaunch50'],
  ['product launch', 'ProductLaunch50'],
  ['launch pack', 'ProductLaunch50'],
  ['product launch 100', 'ProductLaunch100'],
  ['monthly seller', 'MonthlySellerRetainer'],
  ['monthly retainer', 'MonthlySellerRetainer'],
  ['seller retainer', 'MonthlySellerRetainer'],
  ['agency white label', 'AgencyWhiteLabel'],
  ['white label', 'AgencyWhiteLabel'],
  ['agency', 'AgencyWhiteLabel'],
  ['custom', 'Custom'],
];

const packageAliasMap = new Map<string, RequiredPackageKey>([
  ...REQUIRED_PACKAGE_KEYS.map((key) => [key.toLowerCase(), key] as [string, RequiredPackageKey]),
  ...DEFAULT_PACKAGES.map((pkg) => [pkg.name.toLowerCase(), pkg.key] as [string, RequiredPackageKey]),
  ...DEFAULT_PACKAGES.map((pkg) => [pkg.publicSlug.toLowerCase(), pkg.key] as [string, RequiredPackageKey]),
  ...packageAliasEntries,
]);

export function normalizeChannelToken(value: string) {
  return value.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function toCanonicalSalesChannelKey(value: unknown, fallback: RequiredSalesChannelKey = 'Direct'): RequiredSalesChannelKey {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  const exact = REQUIRED_SALES_CHANNEL_KEYS.find((key) => key.toLowerCase() === value.trim().toLowerCase());
  if (exact) return exact;
  const normalized = normalizeChannelToken(value);
  return SALES_CHANNEL_ADAPTER_ALIASES[normalized] ?? fallback;
}

export function adapterKeyForSalesChannel(value: unknown) {
  const canonical = toCanonicalSalesChannelKey(value);
  return SALES_CHANNEL_ADAPTER_KEY_BY_CHANNEL[canonical];
}

export function getSalesChannelDefinition(value: unknown): SalesChannelDefinition | undefined {
  const canonical = toCanonicalSalesChannelKey(value);
  return DEFAULT_SALES_CHANNELS.find((channel) => channel.key === canonical);
}

export function toCanonicalPackageKey(value: unknown, fallback: RequiredPackageKey = 'QuickCleanup10'): RequiredPackageKey {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  const raw = value.trim();
  const direct = REQUIRED_PACKAGE_KEYS.find((key) => key.toLowerCase() === raw.toLowerCase());
  if (direct) return direct;
  const normalized = raw.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return packageAliasMap.get(raw.toLowerCase()) ?? packageAliasMap.get(normalized) ?? fallback;
}

export function buildExternalOrderDedupeKey(input: { organizationId?: string; channelName: string; externalOrderId: string }) {
  const org = input.organizationId ? `${input.organizationId}:` : '';
  return `${org}${toCanonicalSalesChannelKey(input.channelName)}:${input.externalOrderId}`.toLowerCase();
}

export function requiresManualMarketplaceWorkflow(channelName: string) {
  const definition = getSalesChannelDefinition(channelName);
  if (!definition) return true;
  return definition.defaultMode === 'MANUAL' || definition.defaultMode === 'CSV_IMPORT' || definition.marketplaceSafety.some((rule) => /manual|do not scrape|approved/i.test(rule));
}

export function safeMarketplaceAutomationNote(channelName: string) {
  const definition = getSalesChannelDefinition(channelName);
  const safety = definition?.marketplaceSafety ?? [];
  if (requiresManualMarketplaceWorkflow(channelName)) {
    return 'Manual or approved integration workflow only. Do not scrape private marketplace pages or automate platform messaging outside approved terms.';
  }
  return safety.join(' ') || 'Use official APIs/webhooks only and keep secrets server-side.';
}
