import { type RequiredPackageKey, type RequiredSalesChannelKey } from './database-keys';

export type GenericSalesChannelCategory =
  | 'FREELANCE_MARKETPLACE'
  | 'LOCAL_LEAD_DIRECTORY'
  | 'SOCIAL_PROFILE'
  | 'COMMUNITY_PLATFORM'
  | 'LAUNCH_DIRECTORY'
  | 'BUSINESS_DIRECTORY';

export type GenericSalesChannelWorkflowStatus =
  | 'LEAD_CAPTURED'
  | 'QUALIFICATION_NEEDED'
  | 'PROPOSAL_DRAFTED'
  | 'WAITING_FOR_RESPONSE'
  | 'ORDER_CONFIRMED'
  | 'UPLOAD_LINK_SENT'
  | 'FILES_RECEIVED'
  | 'JOB_CREATED'
  | 'IN_FULFILLMENT'
  | 'DELIVERY_READY'
  | 'DELIVERED_ON_SOURCE'
  | 'FOLLOW_UP_NEEDED'
  | 'RETAINER_CONVERTED'
  | 'CLOSED_WON'
  | 'CLOSED_LOST'
  | 'DO_NOT_CONTACT';

export type GenericSalesChannelTemplateType = 'PROPOSAL' | 'FOLLOW_UP' | 'DELIVERY' | 'RETAINER_UPSELL' | 'CASE_STUDY_REQUEST';
export type GenericSalesChannelLeadIntent = 'IMAGE_CLEANUP' | 'MARKETPLACE_PACK' | 'LOCAL_LISTING' | 'AGENCY_WHITE_LABEL' | 'RETAINER' | 'CUSTOM';
export type GenericSalesChannelDeliveryMode = 'SOURCE_PLATFORM_MESSAGE' | 'SOURCE_PLATFORM_WITH_ALLOWED_LINK' | 'EMAIL_WITH_ALLOWED_LINK' | 'MANUAL_EXTERNAL_DELIVERY_RECORDED';

export type OtherSalesChannelDefinition = {
  key: RequiredSalesChannelKey;
  label: string;
  category: GenericSalesChannelCategory;
  defaultPackageKey: RequiredPackageKey;
  defaultIntent: GenericSalesChannelLeadIntent;
  defaultDeliveryMode: GenericSalesChannelDeliveryMode;
  createsUploadLink: boolean;
  supportsProposalTemplate: boolean;
  supportsFollowUp: boolean;
  revenueAttributionRequired: boolean;
  manualOnly: boolean;
  sourceHints: string[];
  safeDescription: string;
};

export const OTHER_SALES_CHANNEL_PROVIDER_KEY = 'other-sales-channels' as const;

export const OTHER_SALES_CHANNEL_SAFE_COPY =
  'ListingLift prepares platform-ready draft product, marketplace, local-listing, and ecommerce image files for seller review. Review files against current platform guidelines before publishing. Marketplace approval, ranking, sales, conversion, ad performance, product approval, or listing approval are not guaranteed.';

export const OTHER_SALES_CHANNEL_SAFETY_RULES = [
  'Use manual or approved integration workflows only.',
  'Do not scrape private pages, private messages, lead inboxes, customer records, groups, or directories.',
  'Do not store marketplace, directory, or social platform passwords.',
  'Do not automate proposals, DMs, comments, replies, group posts, bookings, or lead replies unless the platform explicitly permits the integration.',
  'Keep delivery inside the source platform where platform rules require it.',
  'Use external upload/download links only where allowed and with customer consent.',
  'Capture only the minimal source attribution, client, job, and revenue fields needed for fulfillment.',
  'Do not guarantee marketplace compliance, approval, ranking, sales, conversion, ad performance, product approval, or listing approval.',
] as const;

export const DEFAULT_OTHER_SALES_CHANNELS: OtherSalesChannelDefinition[] = [
  { key: 'Freelancer', label: 'Freelancer.com', category: 'FREELANCE_MARKETPLACE', defaultPackageKey: 'MarketplaceListing50', defaultIntent: 'MARKETPLACE_PACK', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['freelancer', 'project', 'bid', 'milestone'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'PeoplePerHour', label: 'PeoplePerHour', category: 'FREELANCE_MARKETPLACE', defaultPackageKey: 'MarketplaceListing25', defaultIntent: 'MARKETPLACE_PACK', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['peopleperhour', 'hourlie', 'project'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Guru', label: 'Guru', category: 'FREELANCE_MARKETPLACE', defaultPackageKey: 'MarketplaceListing50', defaultIntent: 'AGENCY_WHITE_LABEL', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['guru', 'workroom', 'project'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Contra', label: 'Contra', category: 'FREELANCE_MARKETPLACE', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'CUSTOM', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['contra', 'portfolio', 'inquiry'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Thumbtack', label: 'Thumbtack', category: 'LOCAL_LEAD_DIRECTORY', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['thumbtack', 'lead', 'local business'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Bark', label: 'Bark', category: 'LOCAL_LEAD_DIRECTORY', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['bark', 'lead', 'local'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Houzz', label: 'Houzz', category: 'LOCAL_LEAD_DIRECTORY', defaultPackageKey: 'MarketplaceListing50', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['houzz', 'interior', 'local service', 'listing visuals'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'LinkedIn', label: 'LinkedIn services/page lead', category: 'SOCIAL_PROFILE', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'AGENCY_WHITE_LABEL', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['linkedin', 'services', 'company page'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'FacebookBusinessPage', label: 'Facebook business page', category: 'SOCIAL_PROFILE', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['facebook page', 'meta business', 'local'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Instagram', label: 'Instagram profile/shop link', category: 'SOCIAL_PROFILE', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'IMAGE_CLEANUP', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['instagram', 'profile link', 'shop link'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'TikTokProfile', label: 'TikTok profile link', category: 'SOCIAL_PROFILE', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'IMAGE_CLEANUP', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['tiktok profile', 'creator bio'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'YouTube', label: 'YouTube description link', category: 'SOCIAL_PROFILE', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'CUSTOM', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['youtube', 'description link', 'creator'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'XTwitter', label: 'X / Twitter profile link', category: 'SOCIAL_PROFILE', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'IMAGE_CLEANUP', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['x', 'twitter', 'profile'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Lemon8', label: 'Lemon8 profile', category: 'SOCIAL_PROFILE', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'IMAGE_CLEANUP', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['lemon8', 'creator bio'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Pinterest', label: 'Pinterest business profile', category: 'SOCIAL_PROFILE', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'IMAGE_CLEANUP', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['pinterest', 'pin', 'business profile'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'ProductHunt', label: 'Product Hunt', category: 'LAUNCH_DIRECTORY', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'CUSTOM', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['product hunt', 'launch'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'IndieHackers', label: 'Indie Hackers', category: 'COMMUNITY_PLATFORM', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'CUSTOM', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['indie hackers', 'founder community'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'AppSumo', label: 'AppSumo later', category: 'LAUNCH_DIRECTORY', defaultPackageKey: 'AgencyWhiteLabel', defaultIntent: 'AGENCY_WHITE_LABEL', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['appsumo', 'deal', 'launch'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'ChamberOfCommerce', label: 'Local chamber directory', category: 'BUSINESS_DIRECTORY', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['chamber', 'local directory'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'GoogleBusinessProfile', label: 'Google Business Profile', category: 'BUSINESS_DIRECTORY', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['google business profile', 'gbp', 'local listing'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Yelp', label: 'Yelp', category: 'BUSINESS_DIRECTORY', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'EMAIL_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['yelp', 'local listing'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Craigslist', label: 'Craigslist', category: 'LOCAL_LEAD_DIRECTORY', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['craigslist', 'local classifieds'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Nextdoor', label: 'Nextdoor', category: 'LOCAL_LEAD_DIRECTORY', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'LOCAL_LISTING', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['nextdoor', 'local business'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Discord', label: 'Discord', category: 'COMMUNITY_PLATFORM', defaultPackageKey: 'QuickCleanup10', defaultIntent: 'IMAGE_CLEANUP', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: false, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['discord', 'community'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Skool', label: 'Skool', category: 'COMMUNITY_PLATFORM', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'CUSTOM', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['skool', 'community'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
  { key: 'Circle', label: 'Circle', category: 'COMMUNITY_PLATFORM', defaultPackageKey: 'ProductLaunch50', defaultIntent: 'CUSTOM', defaultDeliveryMode: 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', createsUploadLink: true, supportsProposalTemplate: true, supportsFollowUp: true, revenueAttributionRequired: true, manualOnly: true, sourceHints: ['circle', 'community'], safeDescription: OTHER_SALES_CHANNEL_SAFE_COPY },
];

export const PHASE_23_REQUIRED_OTHER_SALES_CHANNEL_KEYS = DEFAULT_OTHER_SALES_CHANNELS.map((channel) => channel.key);

export function findOtherSalesChannelDefinition(channelKeyOrLabel: string) {
  const normalized = channelKeyOrLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
  return DEFAULT_OTHER_SALES_CHANNELS.find((channel) =>
    channel.key.toLowerCase() === channelKeyOrLabel.trim().toLowerCase() ||
    channel.label.toLowerCase().replace(/[^a-z0-9]+/g, '') === normalized ||
    channel.sourceHints.some((hint) => hint.toLowerCase().replace(/[^a-z0-9]+/g, '') === normalized),
  );
}

export function buildGenericSalesChannelDedupeKey(input: { channelKey: string; externalReference: string; organizationId?: string }) {
  const org = input.organizationId ? `${input.organizationId}:` : '';
  const channel = input.channelKey.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const reference = input.externalReference.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${org}${channel}:${reference}`;
}

export function redactGenericSalesChannelContact(value?: string) {
  if (!value) return undefined;
  const clean = value.trim();
  if (clean.includes('@')) {
    const [local, domain] = clean.split('@');
    return `${local.slice(0, 1)}***@${domain}`;
  }
  if (clean.length <= 2) return '**';
  return `${clean.slice(0, 1)}***${clean.slice(-1)}`;
}

export function buildOtherSalesChannelProposalTemplate(input: { channelLabel?: string; buyerName?: string; packageLabel?: string; imageCount?: number; intent?: string }) {
  const greeting = input.buyerName ? `Hi ${input.buyerName},` : 'Hi,';
  const channel = input.channelLabel ? ` via ${input.channelLabel}` : '';
  const packageLabel = input.packageLabel ?? 'a ListingLift image cleanup pack';
  const imageCount = input.imageCount ? `${input.imageCount} images` : 'your product images';
  return `${greeting}\n\nThanks for reaching out${channel}. ListingLift can turn ${imageCount} into clean, organized, platform-ready draft files using ${packageLabel}. We can prepare white-background JPGs, transparent PNGs, common marketplace/social sizes, smart file names, organized folders, and a seller-review recommended ZIP delivery.\n\nI can send a secure upload link, review the files after processing, and deliver the final image pack once it passes internal quality control. Please review all final files against the current guidelines for your target marketplace before publishing. Marketplace approval, ranking, sales, conversion, ad performance, product approval, or listing approval are not guaranteed.`;
}

export function buildOtherSalesChannelFollowUpTemplate(input: { buyerName?: string; nextStep?: string; channelLabel?: string }) {
  const greeting = input.buyerName ? `Hi ${input.buyerName},` : 'Hi,';
  const next = input.nextStep ?? 'send a secure upload link or confirm the best image pack for your product photos';
  const channel = input.channelLabel ? ` on ${input.channelLabel}` : '';
  return `${greeting}\n\nFollowing up${channel}. I can ${next}. ListingLift works best when we have the original product photos, target platform, SKU/file naming preference, and deadline. All deliverables are platform-ready drafts with seller review recommended.`;
}

export function isUnsafeOtherSalesChannelAction(action: string) {
  const lower = action.toLowerCase();
  return ['scrape', 'password', 'private message', 'auto dm', 'automated dm', 'auto comment', 'auto proposal', 'mass message', 'group spam', 'lead inbox scraping', 'profile scraping', 'booking automation'].some((needle) => lower.includes(needle));
}
