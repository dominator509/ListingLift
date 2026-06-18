import { REQUIRED_PRESET_KEYS, type RequiredPresetKey } from './database-keys';

export type OutputFormat = 'JPG' | 'PNG' | 'WEBP' | 'CSV' | 'TXT' | 'ZIP' | 'PDF';
export type BackgroundType = 'WHITE' | 'TRANSPARENT' | 'BRAND_COLOR' | 'ORIGINAL' | 'SOFT_SHADOW' | 'CUSTOM';
export type PresetOrientation = 'square' | 'vertical' | 'horizontal' | 'custom';
export type PresetScope = 'system' | 'organization' | 'client';
export type PresetQualityCheckKey =
  | 'edge_quality'
  | 'product_not_cut_off'
  | 'background_matches_requirement'
  | 'safe_margin'
  | 'target_dimensions'
  | 'file_size'
  | 'format'
  | 'naming'
  | 'folder_destination'
  | 'seller_review_required';

export type PresetFolderDestination = {
  rootFolder: string;
  platformFolder: string;
  outputFolder: string;
};

export type PlatformPreset = {
  key: string;
  requiredKey?: RequiredPresetKey;
  platform: string;
  platformKey: string;
  name: string;
  description: string;
  width: number;
  height: number;
  aspectRatio: string;
  orientation: PresetOrientation;
  format: OutputFormat;
  folderPath: string;
  folderDestination: PresetFolderDestination;
  background: BackgroundType;
  compressionTargetKb: number | null;
  maxFileSizeKb: number | null;
  safeMarginPercent: number;
  namingConvention: string;
  recommendedUse: string;
  qualityChecks: PresetQualityCheckKey[];
  channelTags: string[];
  safeLanguage: string;
  marketplaceSafeClaim: string;
  sellerReviewRequired: boolean;
  supportsTransparent: boolean;
  supportsWhiteBackground: boolean;
  editable: boolean;
  active: boolean;
  system: boolean;
  sortOrder: number;
};

export type PresetSelectorOption = {
  key: string;
  label: string;
  platform: string;
  dimensions: string;
  format: OutputFormat;
  folderPath: string;
  safeLanguage: string;
  recommendedUse: string;
};

export type PresetOutputPlanInput = {
  presetKey: string;
  clientName: string;
  jobId: string;
  sku?: string | null;
  productName?: string | null;
  sourceFileBaseName?: string | null;
  index: number;
};

export type PresetOutputPlan = {
  presetKey: string;
  platform: string;
  folderPath: string;
  fileName: string;
  relativePath: string;
  width: number;
  height: number;
  format: OutputFormat;
  background: BackgroundType;
  safeLanguage: string;
  qualityChecks: PresetQualityCheckKey[];
};

export const SAFE_PRESET_LANGUAGE = 'platform-ready draft; seller-review recommended';
export const PRESET_SAFE_CLAIM = 'Formatted for common marketplace use. Review against current platform guidelines before publishing.';
export const DEFAULT_DELIVERY_ROOT_FOLDER = 'ListingLift_Delivery';

const baseQualityChecks: PresetQualityCheckKey[] = [
  'edge_quality',
  'product_not_cut_off',
  'background_matches_requirement',
  'safe_margin',
  'target_dimensions',
  'file_size',
  'format',
  'naming',
  'folder_destination',
  'seller_review_required',
];

function destination(platformFolder: string, outputFolder: string): PresetFolderDestination {
  return {
    rootFolder: DEFAULT_DELIVERY_ROOT_FOLDER,
    platformFolder,
    outputFolder,
  };
}

function preset(input: Omit<PlatformPreset, 'key' | 'requiredKey' | 'safeLanguage' | 'marketplaceSafeClaim' | 'sellerReviewRequired' | 'qualityChecks' | 'active' | 'system' | 'folderDestination'> & {
  requiredKey: RequiredPresetKey;
  folderDestination: PresetFolderDestination;
  qualityChecks?: PresetQualityCheckKey[];
  safeLanguage?: string;
  marketplaceSafeClaim?: string;
  sellerReviewRequired?: boolean;
  active?: boolean;
  system?: boolean;
}): PlatformPreset {
  return {
    ...input,
    key: input.requiredKey,
    safeLanguage: input.safeLanguage ?? SAFE_PRESET_LANGUAGE,
    marketplaceSafeClaim: input.marketplaceSafeClaim ?? PRESET_SAFE_CLAIM,
    sellerReviewRequired: input.sellerReviewRequired ?? true,
    qualityChecks: input.qualityChecks ?? baseQualityChecks,
    active: input.active ?? true,
    system: input.system ?? true,
  };
}

export const DEFAULT_PLATFORM_PRESETS: PlatformPreset[] = [
  preset({
    requiredKey: 'AmazonMainImageDraft',
    platform: 'Amazon',
    platformKey: 'amazon',
    name: 'Amazon Main Image Draft',
    description: 'White-background square draft intended for seller review before use as a marketplace main image.',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'JPG',
    folderPath: 'Amazon/white-background',
    folderDestination: destination('Amazon', 'white-background'),
    background: 'WHITE',
    compressionTargetKb: 900,
    maxFileSizeKb: 1000,
    safeMarginPercent: 6,
    namingConvention: '{sku}_amazon_main_{index}.jpg',
    recommendedUse: 'Marketplace main image draft for seller-side review.',
    channelTags: ['AmazonManual', 'marketplace', 'white-background'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 10,
  }),
  preset({
    requiredKey: 'AmazonSecondaryImageDraft',
    platform: 'Amazon',
    platformKey: 'amazon',
    name: 'Amazon Secondary Image Draft',
    description: 'Square secondary image draft for alternate angles or feature photos.',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'JPG',
    folderPath: 'Amazon/secondary-images',
    folderDestination: destination('Amazon', 'secondary-images'),
    background: 'WHITE',
    compressionTargetKb: 900,
    maxFileSizeKb: 1000,
    safeMarginPercent: 5,
    namingConvention: '{sku}_amazon_secondary_{index}.jpg',
    recommendedUse: 'Marketplace secondary image draft for seller-side review.',
    channelTags: ['AmazonManual', 'marketplace', 'secondary'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 20,
  }),
  preset({
    requiredKey: 'EtsyListingSquare',
    platform: 'Etsy',
    platformKey: 'etsy',
    name: 'Etsy Listing Square',
    description: 'Square product listing image draft for Etsy storefront review.',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'JPG',
    folderPath: 'Etsy/square-listing',
    folderDestination: destination('Etsy', 'square-listing'),
    background: 'WHITE',
    compressionTargetKb: 900,
    maxFileSizeKb: 1000,
    safeMarginPercent: 5,
    namingConvention: '{sku}_etsy_square_{index}.jpg',
    recommendedUse: 'Square listing draft for marketplace review.',
    channelTags: ['Etsy', 'marketplace', 'square'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 30,
  }),
  preset({
    requiredKey: 'EbayListingSquare',
    platform: 'eBay',
    platformKey: 'ebay',
    name: 'eBay Listing Square',
    description: 'Square listing draft for eBay seller review.',
    width: 1600,
    height: 1600,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'JPG',
    folderPath: 'eBay/square-listing',
    folderDestination: destination('eBay', 'square-listing'),
    background: 'WHITE',
    compressionTargetKb: 850,
    maxFileSizeKb: 950,
    safeMarginPercent: 5,
    namingConvention: '{sku}_ebay_square_{index}.jpg',
    recommendedUse: 'Square marketplace image draft for seller review.',
    channelTags: ['EbayManual', 'marketplace', 'square'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 40,
  }),
  preset({
    requiredKey: 'ShopifyProductImage',
    platform: 'Shopify',
    platformKey: 'shopify',
    name: 'Shopify Product Image',
    description: 'Clean product-gallery image for Shopify product pages.',
    width: 2048,
    height: 2048,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'JPG',
    folderPath: 'Shopify/product-gallery',
    folderDestination: destination('Shopify', 'product-gallery'),
    background: 'WHITE',
    compressionTargetKb: 1000,
    maxFileSizeKb: 1200,
    safeMarginPercent: 5,
    namingConvention: '{sku}_shopify_product_{index}.jpg',
    recommendedUse: 'Product gallery image draft for ecommerce review.',
    channelTags: ['Shopify', 'ecommerce', 'gallery'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 50,
  }),
  preset({
    requiredKey: 'TikTokShopVertical',
    platform: 'TikTok Shop',
    platformKey: 'tiktok-shop',
    name: 'TikTok Shop Vertical',
    description: 'Vertical commerce image draft for social shopping placements.',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    orientation: 'vertical',
    format: 'JPG',
    folderPath: 'TikTok-Shop/vertical',
    folderDestination: destination('TikTok-Shop', 'vertical'),
    background: 'BRAND_COLOR',
    compressionTargetKb: 1000,
    maxFileSizeKb: 1200,
    safeMarginPercent: 8,
    namingConvention: '{sku}_tiktok_vertical_{index}.jpg',
    recommendedUse: 'Vertical social-commerce draft for seller review.',
    channelTags: ['TikTokShop', 'social-commerce', 'vertical'],
    supportsTransparent: false,
    supportsWhiteBackground: false,
    editable: true,
    sortOrder: 60,
  }),
  preset({
    requiredKey: 'InstagramSquare',
    platform: 'Instagram',
    platformKey: 'instagram',
    name: 'Instagram Square',
    description: 'Square social-commerce product visual draft.',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'JPG',
    folderPath: 'Instagram/square',
    folderDestination: destination('Instagram', 'square'),
    background: 'BRAND_COLOR',
    compressionTargetKb: 850,
    maxFileSizeKb: 1000,
    safeMarginPercent: 7,
    namingConvention: '{sku}_instagram_square_{index}.jpg',
    recommendedUse: 'Square social image draft for seller or creator review.',
    channelTags: ['Instagram', 'social-commerce', 'square'],
    supportsTransparent: false,
    supportsWhiteBackground: false,
    editable: true,
    sortOrder: 70,
  }),
  preset({
    requiredKey: 'InstagramStoryReelVertical',
    platform: 'Instagram',
    platformKey: 'instagram',
    name: 'Instagram Story/Reel Vertical',
    description: 'Vertical product visual draft for story or reel placements.',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    orientation: 'vertical',
    format: 'JPG',
    folderPath: 'Instagram/story',
    folderDestination: destination('Instagram', 'story'),
    background: 'BRAND_COLOR',
    compressionTargetKb: 1000,
    maxFileSizeKb: 1200,
    safeMarginPercent: 8,
    namingConvention: '{sku}_instagram_story_{index}.jpg',
    recommendedUse: 'Vertical social-commerce draft for creator review.',
    channelTags: ['Instagram', 'social-commerce', 'vertical'],
    supportsTransparent: false,
    supportsWhiteBackground: false,
    editable: true,
    sortOrder: 80,
  }),
  preset({
    requiredKey: 'FacebookMarketplaceSquare',
    platform: 'Facebook Marketplace',
    platformKey: 'facebook-marketplace',
    name: 'Facebook Marketplace Square',
    description: 'Square product image draft for manual marketplace listing workflows.',
    width: 1200,
    height: 1200,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'JPG',
    folderPath: 'Facebook-Marketplace/square',
    folderDestination: destination('Facebook-Marketplace', 'square'),
    background: 'WHITE',
    compressionTargetKb: 900,
    maxFileSizeKb: 1000,
    safeMarginPercent: 5,
    namingConvention: '{sku}_facebook_marketplace_{index}.jpg',
    recommendedUse: 'Manual marketplace listing image draft for seller review.',
    channelTags: ['FacebookMarketplace', 'marketplace', 'square'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 90,
  }),
  preset({
    requiredKey: 'PinterestPin',
    platform: 'Pinterest',
    platformKey: 'pinterest',
    name: 'Pinterest Pin',
    description: 'Vertical pin-style product visual draft.',
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
    orientation: 'vertical',
    format: 'JPG',
    folderPath: 'Pinterest/pin',
    folderDestination: destination('Pinterest', 'pin'),
    background: 'BRAND_COLOR',
    compressionTargetKb: 1000,
    maxFileSizeKb: 1200,
    safeMarginPercent: 8,
    namingConvention: '{sku}_pinterest_pin_{index}.jpg',
    recommendedUse: 'Pin-style visual draft for content review.',
    channelTags: ['Pinterest', 'social-commerce', 'vertical'],
    supportsTransparent: false,
    supportsWhiteBackground: false,
    editable: true,
    sortOrder: 100,
  }),
  preset({
    requiredKey: 'WebsiteProductGallery',
    platform: 'Website',
    platformKey: 'website',
    name: 'Website Product Gallery',
    description: 'Compressed product-gallery draft for websites and landing pages.',
    width: 1600,
    height: 1600,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'WEBP',
    folderPath: 'Website/product-gallery',
    folderDestination: destination('Website', 'product-gallery'),
    background: 'WHITE',
    compressionTargetKb: 650,
    maxFileSizeKb: 800,
    safeMarginPercent: 5,
    namingConvention: '{sku}_website_gallery_{index}.webp',
    recommendedUse: 'Website gallery draft for owner review.',
    channelTags: ['website', 'ecommerce', 'webp'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 110,
  }),
  preset({
    requiredKey: 'GumroadProductOfferImage',
    platform: 'Gumroad',
    platformKey: 'gumroad',
    name: 'Gumroad Product/Offer Image',
    description: 'Offer image draft for Gumroad product pages and digital product listings.',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    orientation: 'horizontal',
    format: 'JPG',
    folderPath: 'Gumroad/offer-images',
    folderDestination: destination('Gumroad', 'offer-images'),
    background: 'BRAND_COLOR',
    compressionTargetKb: 900,
    maxFileSizeKb: 1000,
    safeMarginPercent: 7,
    namingConvention: '{sku}_gumroad_offer_{index}.jpg',
    recommendedUse: 'Offer image draft for product-page review.',
    channelTags: ['Gumroad', 'offer', 'horizontal'],
    supportsTransparent: false,
    supportsWhiteBackground: false,
    editable: true,
    sortOrder: 120,
  }),
  preset({
    requiredKey: 'RestaurantMenuItemImage',
    platform: 'Restaurant/Local Listings',
    platformKey: 'restaurant-local',
    name: 'Restaurant Menu Item Image',
    description: 'Menu item image draft for local listings and restaurant sites.',
    width: 1600,
    height: 1200,
    aspectRatio: '4:3',
    orientation: 'horizontal',
    format: 'JPG',
    folderPath: 'Restaurants/menu-items',
    folderDestination: destination('Restaurants', 'menu-items'),
    background: 'WHITE',
    compressionTargetKb: 900,
    maxFileSizeKb: 1000,
    safeMarginPercent: 5,
    namingConvention: '{sku}_menu_item_{index}.jpg',
    recommendedUse: 'Menu or local-listing image draft for owner review.',
    channelTags: ['GoogleBusinessProfile', 'Yelp', 'local-business', 'restaurant'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 130,
  }),
  preset({
    requiredKey: 'RealEstateListingCleanup',
    platform: 'Real Estate/Local Listings',
    platformKey: 'real-estate-local',
    name: 'Real Estate Listing Visual Cleanup',
    description: 'Horizontal visual cleanup draft for real estate or local-service listings.',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    orientation: 'horizontal',
    format: 'JPG',
    folderPath: 'Real-Estate/listing-cleanup',
    folderDestination: destination('Real-Estate', 'listing-cleanup'),
    background: 'ORIGINAL',
    compressionTargetKb: 1200,
    maxFileSizeKb: 1500,
    safeMarginPercent: 4,
    namingConvention: '{sku}_real_estate_{index}.jpg',
    recommendedUse: 'Listing visual cleanup draft; not a property or compliance guarantee.',
    channelTags: ['local-business', 'real-estate', 'horizontal'],
    supportsTransparent: false,
    supportsWhiteBackground: false,
    editable: true,
    sortOrder: 140,
  }),
  preset({
    requiredKey: 'CustomClientPreset',
    platform: 'Custom',
    platformKey: 'custom',
    name: 'Custom Client Preset',
    description: 'Editable custom preset scaffold for client-specific dimensions, naming, and folders.',
    width: 2000,
    height: 2000,
    aspectRatio: 'custom',
    orientation: 'custom',
    format: 'JPG',
    folderPath: 'Custom',
    folderDestination: destination('Custom', 'custom-output'),
    background: 'CUSTOM',
    compressionTargetKb: null,
    maxFileSizeKb: null,
    safeMarginPercent: 5,
    namingConvention: '{sku}_custom_{index}',
    recommendedUse: 'Client-specific custom export draft.',
    channelTags: ['custom'],
    supportsTransparent: true,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 150,
  }),
  preset({
    requiredKey: 'TransparentPngCutout',
    platform: 'General',
    platformKey: 'general',
    name: 'Transparent PNG Cutout',
    description: 'Product image with transparent background, suitable for any marketplace or platform that accepts PNG.',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'PNG',
    folderPath: 'General/transparent-png',
    folderDestination: destination('General', 'transparent-png'),
    background: 'TRANSPARENT',
    compressionTargetKb: null,
    maxFileSizeKb: null,
    safeMarginPercent: 5,
    namingConvention: '{sku}_transparent_{index}.png',
    recommendedUse: 'Transparent PNG cutout for flexible marketplace use.',
    channelTags: ['general', 'png', 'transparent'],
    supportsTransparent: true,
    supportsWhiteBackground: false,
    editable: true,
    sortOrder: 200,
  }),
  preset({
    requiredKey: 'WhiteJpgCatalog',
    platform: 'General',
    platformKey: 'general',
    name: 'White JPG Catalog',
    description: 'Clean white-background catalog image for marketplace or ecommerce listings.',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    orientation: 'square',
    format: 'JPG',
    folderPath: 'General/white-catalog',
    folderDestination: destination('General', 'white-catalog'),
    background: 'WHITE',
    compressionTargetKb: 900,
    maxFileSizeKb: 1000,
    safeMarginPercent: 5,
    namingConvention: '{sku}_catalog_{index}.jpg',
    recommendedUse: 'White-background catalog image draft for seller review.',
    channelTags: ['general', 'jpg', 'catalog'],
    supportsTransparent: false,
    supportsWhiteBackground: true,
    editable: true,
    sortOrder: 210,
  }),
];

const defaultPresetKeySet = new Set(DEFAULT_PLATFORM_PRESETS.map((preset) => preset.key));
export const MISSING_DEFAULT_PRESET_KEYS = REQUIRED_PRESET_KEYS.filter((key) => !defaultPresetKeySet.has(key));

export function getPresetCoverageReport() {
  const provided = DEFAULT_PLATFORM_PRESETS.map((preset) => preset.key);
  return {
    required: REQUIRED_PRESET_KEYS,
    provided,
    missing: MISSING_DEFAULT_PRESET_KEYS,
    extra: provided.filter((key) => !REQUIRED_PRESET_KEYS.includes(key as RequiredPresetKey)),
    complete: MISSING_DEFAULT_PRESET_KEYS.length === 0,
  };
}

export function findDefaultPreset(key: string) {
  return DEFAULT_PLATFORM_PRESETS.find((preset) => preset.key === key || preset.platformKey === key || preset.name.toLowerCase() === key.toLowerCase()) ?? null;
}

export const getPlatformPresetByKey = findDefaultPreset;

export function listPresetSelectorOptions(presets: PlatformPreset[] = DEFAULT_PLATFORM_PRESETS): PresetSelectorOption[] {
  return presets
    .filter((preset) => preset.active)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((preset) => ({
      key: preset.key,
      label: `${preset.platform} — ${preset.name}`,
      platform: preset.platform,
      dimensions: `${preset.width}×${preset.height}`,
      format: preset.format,
      folderPath: preset.folderPath,
      safeLanguage: preset.safeLanguage,
      recommendedUse: preset.recommendedUse,
    }));
}

export function groupPresetsByPlatform(presets: PlatformPreset[] = DEFAULT_PLATFORM_PRESETS) {
  return presets.reduce<Record<string, PlatformPreset[]>>((groups, preset) => {
    groups[preset.platform] = groups[preset.platform] ?? [];
    groups[preset.platform].push(preset);
    groups[preset.platform].sort((a, b) => a.sortOrder - b.sortOrder);
    return groups;
  }, {});
}

export function listPresetsForPlatform(platform: string, presets: PlatformPreset[] = DEFAULT_PLATFORM_PRESETS) {
  const normalized = platform.trim().toLowerCase();
  return presets.filter((preset) => preset.platform.toLowerCase() === normalized || preset.platformKey === normalized || preset.channelTags.some((tag) => tag.toLowerCase() === normalized));
}

export function extensionForFormat(format: OutputFormat) {
  return format.toLowerCase();
}

export function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : greatestCommonDivisor(b, a % b);
}

export function deriveAspectRatio(width: number, height: number) {
  const divisor = greatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export function normalizeFolderPath(path: string) {
  const raw = path.trim().replace(/\\+/g, '/');
  if (!raw) throw new Error('Folder path is required.');
  if (raw.startsWith('/')) throw new Error('Folder path must be relative.');
  if (raw.includes('..')) throw new Error('Folder path cannot include parent-directory traversal.');
  if (/^[a-z]:/i.test(raw)) throw new Error('Folder path cannot be an absolute drive path.');
  const trimmed = raw.replace(/\/+$/g, '');
  return trimmed
    .split('/')
    .map((segment) => sanitizePathSegment(segment))
    .join('/');
}

export function sanitizePathSegment(value: string) {
  const safe = value
    .trim()
    .replace(/[<>:"|?*\x00-\x1f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');
  return safe || 'untitled';
}

export function sanitizeFileStem(value: string | null | undefined) {
  return sanitizePathSegment(value || 'product').toLowerCase();
}

export function validatePresetDefinition(preset: Pick<PlatformPreset, 'key' | 'width' | 'height' | 'format' | 'folderPath' | 'safeMarginPercent' | 'namingConvention' | 'safeLanguage' | 'marketplaceSafeClaim'>) {
  const issues: string[] = [];
  if (!preset.key.trim()) issues.push('Preset key is required.');
  if (!Number.isInteger(preset.width) || preset.width < 64) issues.push('Preset width must be an integer of at least 64 pixels.');
  if (!Number.isInteger(preset.height) || preset.height < 64) issues.push('Preset height must be an integer of at least 64 pixels.');
  if (!preset.format) issues.push('Preset format is required.');
  try {
    normalizeFolderPath(preset.folderPath);
  } catch (error) {
    issues.push(error instanceof Error ? error.message : 'Folder path is invalid.');
  }
  if (!Number.isFinite(preset.safeMarginPercent) || preset.safeMarginPercent < 0 || preset.safeMarginPercent > 25) {
    issues.push('Safe margin percent must be between 0 and 25.');
  }
  if (!preset.namingConvention.includes('{index}')) issues.push('Naming convention must include {index}.');
  if (!preset.safeLanguage.toLowerCase().includes('seller-review')) issues.push('Preset safe language must include seller-review wording.');
  const bannedClaimPattern = /guarantee|guaranteed|compliant|approval|ranking|conversion increase|sales increase/i;
  if (bannedClaimPattern.test(preset.marketplaceSafeClaim)) issues.push('Marketplace safe claim contains prohibited guarantee language.');
  return issues;
}

export function assertValidPresetDefinition<T extends PlatformPreset>(preset: T): T {
  const issues = validatePresetDefinition(preset);
  if (issues.length > 0) throw new Error(`Invalid platform preset: ${issues.join(' ')}`);
  return preset;
}

export function buildPresetFolderPath(preset: Pick<PlatformPreset, 'folderPath'>) {
  return normalizeFolderPath(preset.folderPath);
}

export function buildPresetFileName(input: Pick<PresetOutputPlanInput, 'sku' | 'productName' | 'sourceFileBaseName' | 'index'> & { preset: Pick<PlatformPreset, 'namingConvention' | 'format'> }) {
  const sku = sanitizeFileStem(input.sku ?? input.productName ?? input.sourceFileBaseName ?? 'product');
  const source = sanitizeFileStem(input.sourceFileBaseName ?? sku);
  const index = String(input.index).padStart(2, '0');
  const extension = extensionForFormat(input.preset.format);
  const raw = input.preset.namingConvention
    .replaceAll('{sku}', sku)
    .replaceAll('{product}', sku)
    .replaceAll('{source}', source)
    .replaceAll('{index}', index);
  const fileName = sanitizePathSegment(raw);
  return fileName.toLowerCase().endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;
}

export function buildPresetOutputPlan(input: PresetOutputPlanInput, presets: PlatformPreset[] = DEFAULT_PLATFORM_PRESETS): PresetOutputPlan {
  const preset = presets.find((candidate) => candidate.key === input.presetKey);
  if (!preset) throw new Error(`Unknown preset: ${input.presetKey}`);
  assertValidPresetDefinition(preset);
  const folderPath = buildPresetFolderPath(preset);
  const fileName = buildPresetFileName({ ...input, preset });
  return {
    presetKey: preset.key,
    platform: preset.platform,
    folderPath,
    fileName,
    relativePath: `${folderPath}/${fileName}`,
    width: preset.width,
    height: preset.height,
    format: preset.format,
    background: preset.background,
    safeLanguage: preset.safeLanguage,
    qualityChecks: preset.qualityChecks,
  };
}

export function createCustomPresetDraft(input: {
  organizationSlug: string;
  name: string;
  platform?: string;
  width: number;
  height: number;
  format: OutputFormat;
  background: BackgroundType;
  folderPath: string;
  namingConvention?: string;
  safeMarginPercent?: number;
}): PlatformPreset {
  const platform = input.platform?.trim() || 'Custom';
  const key = `custom_${sanitizeFileStem(input.organizationSlug)}_${sanitizeFileStem(input.name)}`;
  const orientation: PresetOrientation = input.width === input.height ? 'square' : input.width < input.height ? 'vertical' : 'horizontal';
  const draft: PlatformPreset = {
    key,
    platform,
    platformKey: sanitizeFileStem(platform),
    name: input.name.trim(),
    description: 'Organization-level custom preset draft pending admin review.',
    width: input.width,
    height: input.height,
    aspectRatio: deriveAspectRatio(input.width, input.height),
    orientation,
    format: input.format,
    folderPath: normalizeFolderPath(input.folderPath),
    folderDestination: destination(sanitizePathSegment(platform), 'custom-output'),
    background: input.background,
    compressionTargetKb: null,
    maxFileSizeKb: null,
    safeMarginPercent: input.safeMarginPercent ?? 5,
    namingConvention: input.namingConvention ?? '{sku}_custom_{index}',
    recommendedUse: 'Custom platform-ready draft for seller or client review.',
    qualityChecks: baseQualityChecks,
    channelTags: ['custom'],
    safeLanguage: SAFE_PRESET_LANGUAGE,
    marketplaceSafeClaim: PRESET_SAFE_CLAIM,
    sellerReviewRequired: true,
    supportsTransparent: input.format === 'PNG' || input.background === 'TRANSPARENT',
    supportsWhiteBackground: input.background === 'WHITE',
    editable: true,
    active: true,
    system: false,
    sortOrder: 900,
  };
  return assertValidPresetDefinition(draft);
}
