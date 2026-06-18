import { type RequiredPackageKey } from './database-keys';

export type SocialCommerceChannelKey =
  | 'tiktok_shop'
  | 'instagram_shop'
  | 'instagram_profile'
  | 'facebook_marketplace'
  | 'facebook_business_page'
  | 'pinterest'
  | 'tiktok_profile'
  | 'youtube_shorts'
  | 'google_business_profile_social';

export type SocialCommerceChannelType = 'SOCIAL_SHOP' | 'SOCIAL_PROFILE' | 'SOCIAL_MARKETPLACE' | 'LOCAL_SOCIAL' | 'CONTENT_PLATFORM';
export type SocialCommerceWorkflowStatus =
  | 'DRAFT'
  | 'SOURCE_CAPTURED'
  | 'CREATIVE_BRIEF_NEEDED'
  | 'FILES_NEEDED'
  | 'FILES_RECEIVED'
  | 'PROCESSING'
  | 'WAITING_FOR_QC'
  | 'WAITING_FOR_APPROVAL'
  | 'CREATIVE_PLAN_READY'
  | 'DELIVERY_READY'
  | 'DELIVERED_MANUALLY'
  | 'REVISION_REQUESTED'
  | 'UPSELL_READY'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';
export type SocialCommerceDeliveryMode = 'PLATFORM_MANUAL_UPLOAD' | 'EMAIL_WITH_ALLOWED_LINK' | 'DASHBOARD_DOWNLOAD' | 'MANUAL_EXTERNAL_DELIVERY_RECORDED';
export type SocialCommerceCreativeFormat = 'SQUARE_POST' | 'VERTICAL_VIDEO_COVER' | 'STORY_REEL' | 'SHOP_PRODUCT_CARD' | 'PINTEREST_PIN' | 'MARKETPLACE_SQUARE' | 'LOCAL_LISTING_IMAGE';
export type SocialCommerceRevisionStatus = 'NONE' | 'REQUESTED' | 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'DELIVERED' | 'CLOSED';

export type SocialCommerceChannelDefinition = {
  key: SocialCommerceChannelKey;
  label: string;
  channelType: SocialCommerceChannelType;
  packageKey: RequiredPackageKey;
  defaultPresetKeys: string[];
  defaultCreativeFormats: SocialCommerceCreativeFormat[];
  defaultDeliveryMode: SocialCommerceDeliveryMode;
  manualFallbackOnly: boolean;
  supportsExternalLinks: boolean;
  supportsPaidOrderAttribution: boolean;
  safeDescription: string;
};

export const SOCIAL_COMMERCE_SAFE_COPY =
  'ListingLift prepares social-commerce image drafts, marketplace-ready visual variants, and organized creative packs for seller/operator review. Review every file against current platform, merchant, ad, marketplace, and brand requirements before publishing. ListingLift does not guarantee platform approval, product approval, marketplace ranking, reach, sales, conversion, ad performance, or listing approval.';

export const SOCIAL_COMMERCE_SAFETY_RULES = [
  'Use official APIs, approved webhooks, approved platform exports, or manual workflows only.',
  'Do not scrape private social-commerce pages, inboxes, order pages, analytics, profiles, or seller dashboards.',
  'Do not store platform passwords or creator/seller login credentials.',
  'Do not automate DMs, comments, replies, posts, product uploads, or marketplace messages unless an approved integration explicitly permits it.',
  'Treat all captions, hashtags, follow-up messages, delivery messages, and listing copy as manual operator drafts.',
  'Use external delivery links only where platform context and customer consent allow them.',
  'Do not guarantee approval, ranking, reach, views, impressions, sales, conversion, ad results, product approval, or listing approval.',
  'Store only minimal order/source/customer data needed for fulfillment and revenue attribution.',
] as const;

export const DEFAULT_SOCIAL_COMMERCE_CHANNELS: SocialCommerceChannelDefinition[] = [
  {
    key: 'tiktok_shop',
    label: 'TikTok Shop',
    channelType: 'SOCIAL_SHOP',
    packageKey: 'MarketplaceListing25',
    defaultPresetKeys: ['TikTokShopVertical', 'InstagramStoryReelVertical', 'WebsiteProductGallery'],
    defaultCreativeFormats: ['VERTICAL_VIDEO_COVER', 'SHOP_PRODUCT_CARD', 'STORY_REEL'],
    defaultDeliveryMode: 'PLATFORM_MANUAL_UPLOAD',
    manualFallbackOnly: true,
    supportsExternalLinks: false,
    supportsPaidOrderAttribution: true,
    safeDescription: SOCIAL_COMMERCE_SAFE_COPY,
  },
  {
    key: 'instagram_shop',
    label: 'Instagram Shop',
    channelType: 'SOCIAL_SHOP',
    packageKey: 'MarketplaceListing25',
    defaultPresetKeys: ['InstagramSquare', 'InstagramStoryReelVertical', 'TransparentPNG'],
    defaultCreativeFormats: ['SQUARE_POST', 'STORY_REEL', 'SHOP_PRODUCT_CARD'],
    defaultDeliveryMode: 'DASHBOARD_DOWNLOAD',
    manualFallbackOnly: true,
    supportsExternalLinks: true,
    supportsPaidOrderAttribution: true,
    safeDescription: SOCIAL_COMMERCE_SAFE_COPY,
  },
  {
    key: 'facebook_marketplace',
    label: 'Facebook Marketplace',
    channelType: 'SOCIAL_MARKETPLACE',
    packageKey: 'QuickCleanup10',
    defaultPresetKeys: ['FacebookMarketplaceSquare', 'WhiteJPG', 'TransparentPNG'],
    defaultCreativeFormats: ['MARKETPLACE_SQUARE', 'SQUARE_POST'],
    defaultDeliveryMode: 'MANUAL_EXTERNAL_DELIVERY_RECORDED',
    manualFallbackOnly: true,
    supportsExternalLinks: false,
    supportsPaidOrderAttribution: true,
    safeDescription: SOCIAL_COMMERCE_SAFE_COPY,
  },
  {
    key: 'pinterest',
    label: 'Pinterest',
    channelType: 'CONTENT_PLATFORM',
    packageKey: 'ProductLaunch100',
    defaultPresetKeys: ['PinterestPin', 'WebsiteProductGallery', 'InstagramSquare'],
    defaultCreativeFormats: ['PINTEREST_PIN', 'SQUARE_POST'],
    defaultDeliveryMode: 'DASHBOARD_DOWNLOAD',
    manualFallbackOnly: true,
    supportsExternalLinks: true,
    supportsPaidOrderAttribution: false,
    safeDescription: SOCIAL_COMMERCE_SAFE_COPY,
  },
  {
    key: 'instagram_profile',
    label: 'Instagram Profile / Creator',
    channelType: 'SOCIAL_PROFILE',
    packageKey: 'ProductLaunch100',
    defaultPresetKeys: ['InstagramSquare', 'InstagramStoryReelVertical', 'TransparentPNG'],
    defaultCreativeFormats: ['SQUARE_POST', 'STORY_REEL'],
    defaultDeliveryMode: 'DASHBOARD_DOWNLOAD',
    manualFallbackOnly: true,
    supportsExternalLinks: true,
    supportsPaidOrderAttribution: false,
    safeDescription: SOCIAL_COMMERCE_SAFE_COPY,
  },
  {
    key: 'tiktok_profile',
    label: 'TikTok Profile / Creator',
    channelType: 'SOCIAL_PROFILE',
    packageKey: 'ProductLaunch100',
    defaultPresetKeys: ['TikTokShopVertical', 'InstagramStoryReelVertical', 'WebsiteProductGallery'],
    defaultCreativeFormats: ['VERTICAL_VIDEO_COVER', 'STORY_REEL'],
    defaultDeliveryMode: 'DASHBOARD_DOWNLOAD',
    manualFallbackOnly: true,
    supportsExternalLinks: true,
    supportsPaidOrderAttribution: false,
    safeDescription: SOCIAL_COMMERCE_SAFE_COPY,
  },
  {
    key: 'facebook_business_page',
    label: 'Facebook Business Page',
    channelType: 'LOCAL_SOCIAL',
    packageKey: 'MarketplaceListing25',
    defaultPresetKeys: ['FacebookMarketplaceSquare', 'InstagramSquare', 'WebsiteProductGallery'],
    defaultCreativeFormats: ['SQUARE_POST', 'LOCAL_LISTING_IMAGE'],
    defaultDeliveryMode: 'DASHBOARD_DOWNLOAD',
    manualFallbackOnly: true,
    supportsExternalLinks: true,
    supportsPaidOrderAttribution: false,
    safeDescription: SOCIAL_COMMERCE_SAFE_COPY,
  },
];

export function normalizeSocialCommerceChannelKey(value: string): SocialCommerceChannelKey {
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, '_');
  const alias: Record<string, SocialCommerceChannelKey> = {
    tiktok: 'tiktok_profile',
    tik_tok: 'tiktok_profile',
    tiktokshop: 'tiktok_shop',
    tik_tok_shop: 'tiktok_shop',
    instagram: 'instagram_profile',
    instagram_shop: 'instagram_shop',
    facebook: 'facebook_business_page',
    facebook_marketplace: 'facebook_marketplace',
    fb_marketplace: 'facebook_marketplace',
    pinterest: 'pinterest',
    youtube: 'youtube_shorts',
    youtube_shorts: 'youtube_shorts',
    google_business_profile: 'google_business_profile_social',
  };
  const candidate = (alias[normalized] ?? normalized) as SocialCommerceChannelKey;
  return candidate;
}

export function getSocialCommerceChannelDefinition(key: string) {
  const normalized = normalizeSocialCommerceChannelKey(key);
  return DEFAULT_SOCIAL_COMMERCE_CHANNELS.find((channel) => channel.key === normalized) ?? DEFAULT_SOCIAL_COMMERCE_CHANNELS[0];
}

export function normalizeSocialCommerceExternalReference(value?: string) {
  const clean = (value || 'manual-source').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/[^a-z0-9._/-]+/g, '-').replace(/^-|-$/g, '');
  return clean || 'manual-source';
}

export function buildSocialCommerceDedupeKey(input: { organizationId?: string; channelKey: string; externalReference?: string; sourceUrl?: string; buyerHandle?: string }) {
  const org = input.organizationId ? `${input.organizationId}:` : '';
  const channel = normalizeSocialCommerceChannelKey(input.channelKey);
  const ref = normalizeSocialCommerceExternalReference(input.externalReference ?? input.sourceUrl ?? input.buyerHandle ?? 'manual-order');
  return `${org}social-commerce:${channel}:${ref}`;
}

export function redactSocialCommerceIdentity(value?: string) {
  if (!value) return undefined;
  const clean = value.trim();
  if (!clean) return undefined;
  if (clean.includes('@') && clean.includes('.')) {
    const [local, domain] = clean.split('@');
    return `${local.slice(0, 1)}***@${domain}`;
  }
  const noAt = clean.replace(/^@/, '');
  if (noAt.length <= 2) return '@**';
  return `@${noAt.slice(0, 1)}***${noAt.slice(-1)}`;
}

export function buildSocialCommerceDeliveryMessage(input: { channelKey: string; buyerName?: string; archiveName?: string; externalLinkAllowed?: boolean; includeExternalLink?: boolean }) {
  const channel = getSocialCommerceChannelDefinition(input.channelKey);
  const greeting = input.buyerName ? `Hi ${input.buyerName},` : 'Hi,';
  const archive = input.archiveName ?? 'your ListingLift social-commerce image pack';
  const linkLine = input.includeExternalLink && input.externalLinkAllowed && channel.supportsExternalLinks
    ? 'I can provide the secure download link if this platform/customer context permits external delivery links.'
    : 'I can deliver or record delivery through the approved manual platform-safe workflow for this project.';
  return `${greeting}\n\n${archive} is prepared as ${channel.label} image drafts for seller review. The pack may include social-commerce variants, marketplace/product-card drafts, clean-background images, transparent cutouts, platform folders, a manifest, and seller-review notes. ${linkLine}\n\nPlease review all files against current ${channel.label}, brand, ad, marketplace, and product requirements before publishing. Platform approval, product approval, marketplace ranking, reach, sales, conversion, ad performance, or listing approval are not guaranteed.`;
}

export function buildSocialCommerceCreativePlan(input: { channelKey: string; productNames?: string[]; brandColors?: string[]; formats?: SocialCommerceCreativeFormat[]; campaignGoal?: string }) {
  const channel = getSocialCommerceChannelDefinition(input.channelKey);
  const formats = input.formats?.length ? input.formats : channel.defaultCreativeFormats;
  const products = input.productNames?.length ? input.productNames : ['primary product'];
  return {
    channelKey: channel.key,
    channelLabel: channel.label,
    formats,
    presetKeys: channel.defaultPresetKeys,
    productSequence: products.map((name, index) => ({ productName: name, sequence: index + 1, recommendation: `${name}: primary clean product image, detail crop, and platform-specific social-commerce variant.` })),
    captionNotes: [
      'Keep caption copy factual and seller-reviewed.',
      'Avoid ranking, sales, approval, or performance promises.',
      input.campaignGoal ? `Align visuals to campaign goal: ${input.campaignGoal}.` : 'Use product benefit, use case, and visual clarity as the creative focus.',
    ],
    hashtagNotes: ['Use brand/category hashtags only after seller review.', 'Do not imply platform endorsement or guaranteed reach.'],
    safeCopy: SOCIAL_COMMERCE_SAFE_COPY,
  };
}

export function isUnsafeSocialCommerceAction(action: string) {
  const lower = action.toLowerCase();
  return [
    'scrape',
    'password',
    'private inbox',
    'auto dm',
    'automated dm',
    'mass dm',
    'auto comment',
    'auto post',
    'auto upload',
    'auto publish',
    'buy followers',
    'guarantee sales',
    'guarantee ranking',
    'guarantee approval',
    'shadowban bypass',
    'fake engagement',
  ].some((needle) => lower.includes(needle));
}
