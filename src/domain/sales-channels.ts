import { REQUIRED_SALES_CHANNEL_KEYS, type RequiredSalesChannelKey } from './database-keys';

export type IntegrationMode = 'MOCK' | 'MANUAL' | 'API' | 'WEBHOOK' | 'EMAIL_PARSER' | 'CSV_IMPORT';
export type ChannelType = 'DIRECT' | 'PAYMENT' | 'MARKETPLACE' | 'FREELANCE' | 'SOCIAL' | 'ECOMMERCE' | 'LOCAL' | 'COMMUNITY' | 'MANUAL';

export type SalesChannelDefinition = {
  key: RequiredSalesChannelKey;
  name: string;
  channelType: ChannelType;
  defaultMode: IntegrationMode;
  enabledByDefault: boolean;
  marketplaceSafety: string[];
};

const manualOnly = ['Manual workflow by default.', 'Do not scrape private marketplace pages.', 'Respect platform terms and delivery rules.'];

export const DEFAULT_SALES_CHANNELS: SalesChannelDefinition[] = [
  { key: 'Direct', name: 'Direct Website', channelType: 'DIRECT', defaultMode: 'MANUAL', enabledByDefault: true, marketplaceSafety: ['Owned website checkout/upload flow.'] },
  { key: 'Stripe', name: 'Stripe Checkout', channelType: 'PAYMENT', defaultMode: 'WEBHOOK', enabledByDefault: false, marketplaceSafety: ['Verify webhook signatures.', 'Do not expose Stripe secrets to the frontend.'] },
  { key: 'Gumroad', name: 'Gumroad', channelType: 'PAYMENT', defaultMode: 'WEBHOOK', enabledByDefault: false, marketplaceSafety: ['Verify webhook signatures where supported.', 'Normalize sales into ListingLift jobs.'] },
  { key: 'Fiverr', name: 'Fiverr', channelType: 'FREELANCE', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: ['Do not scrape private Fiverr pages.', 'Keep delivery inside Fiverr when required.'] },
  { key: 'Upwork', name: 'Upwork', channelType: 'FREELANCE', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: ['Respect contract and platform communication rules.'] },
  { key: 'Taskrabbit', name: 'Taskrabbit', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: ['Manual workflow unless approved integration exists.'] },
  { key: 'Freelancer', name: 'Freelancer.com', channelType: 'FREELANCE', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'PeoplePerHour', name: 'PeoplePerHour', channelType: 'FREELANCE', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Guru', name: 'Guru', channelType: 'FREELANCE', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Contra', name: 'Contra', channelType: 'FREELANCE', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Thumbtack', name: 'Thumbtack', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Bark', name: 'Bark', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Houzz', name: 'Houzz', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Etsy', name: 'Etsy', channelType: 'ECOMMERCE', defaultMode: 'API', enabledByDefault: false, marketplaceSafety: ['Use official APIs where available.', 'Do not guarantee Etsy approval or ranking.'] },
  { key: 'Shopify', name: 'Shopify', channelType: 'ECOMMERCE', defaultMode: 'API', enabledByDefault: false, marketplaceSafety: ['Use OAuth and scoped app permissions.'] },
  { key: 'FacebookMarketplace', name: 'Facebook Marketplace', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: ['Manual tracking only unless approved API scope exists.'] },
  { key: 'FacebookBusinessPage', name: 'Facebook Business Page', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Instagram', name: 'Instagram', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: ['Manual tracking only unless approved API scope exists.'] },
  { key: 'TikTokShop', name: 'TikTok Shop', channelType: 'ECOMMERCE', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: ['Avoid unapproved automation.', 'Use seller-review recommended language.'] },
  { key: 'TikTokProfile', name: 'TikTok Profile Link', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'AmazonManual', name: 'Amazon Seller Manual/Export', channelType: 'ECOMMERCE', defaultMode: 'CSV_IMPORT', enabledByDefault: false, marketplaceSafety: ['Manual/export workflow unless approved integration exists.', 'Do not guarantee Amazon compliance.'] },
  { key: 'EbayManual', name: 'eBay Manual/Export', channelType: 'ECOMMERCE', defaultMode: 'CSV_IMPORT', enabledByDefault: false, marketplaceSafety: ['Review platform terms before automation.'] },
  { key: 'WooCommerceManual', name: 'WooCommerce Manual/CSV Scaffold', channelType: 'ECOMMERCE', defaultMode: 'CSV_IMPORT', enabledByDefault: false, marketplaceSafety: ['Manual/export workflow unless approved plugin integration exists.', 'Do not store WooCommerce admin passwords.'] },
  { key: 'GoogleBusinessProfile', name: 'Google Business Profile', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Craigslist', name: 'Craigslist', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Nextdoor', name: 'Nextdoor', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Discord', name: 'Discord', channelType: 'COMMUNITY', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Skool', name: 'Skool', channelType: 'COMMUNITY', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Circle', name: 'Circle', channelType: 'COMMUNITY', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'LinkedIn', name: 'LinkedIn', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'YouTube', name: 'YouTube', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'XTwitter', name: 'X / Twitter', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Lemon8', name: 'Lemon8', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Pinterest', name: 'Pinterest', channelType: 'SOCIAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'ProductHunt', name: 'Product Hunt', channelType: 'COMMUNITY', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'IndieHackers', name: 'Indie Hackers', channelType: 'COMMUNITY', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'AppSumo', name: 'AppSumo', channelType: 'MARKETPLACE', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'ChamberOfCommerce', name: 'Chamber of Commerce', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
  { key: 'Yelp', name: 'Yelp', channelType: 'LOCAL', defaultMode: 'MANUAL', enabledByDefault: false, marketplaceSafety: manualOnly },
];

const defaultSalesChannelKeySet = new Set(DEFAULT_SALES_CHANNELS.map((channel) => channel.key));
export const MISSING_DEFAULT_SALES_CHANNEL_KEYS = REQUIRED_SALES_CHANNEL_KEYS.filter((key) => !defaultSalesChannelKeySet.has(key));
