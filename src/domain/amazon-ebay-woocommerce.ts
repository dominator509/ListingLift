import { type RequiredPackageKey } from './database-keys';

export type MarketplaceExportChannelKey = 'amazon_manual' | 'ebay_manual' | 'woocommerce_manual';
export type MarketplaceExportWorkflowStatus =
  | 'DRAFT'
  | 'SOURCE_CAPTURED'
  | 'SELLER_EXPORT_NEEDED'
  | 'FILES_NEEDED'
  | 'FILES_RECEIVED'
  | 'PROCESSING'
  | 'WAITING_FOR_QC'
  | 'WAITING_FOR_APPROVAL'
  | 'EXPORT_PLAN_READY'
  | 'DELIVERY_READY'
  | 'DELIVERED_MANUALLY'
  | 'REVISION_REQUESTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';
export type MarketplaceExportDeliveryMode =
  | 'PLATFORM_MANUAL_UPLOAD'
  | 'SELLER_EXPORT_PACKAGE'
  | 'DASHBOARD_DOWNLOAD'
  | 'MANUAL_EXTERNAL_DELIVERY_RECORDED';
export type MarketplaceImageRole =
  | 'AMAZON_MAIN_IMAGE_DRAFT'
  | 'AMAZON_SECONDARY_IMAGE_DRAFT'
  | 'EBAY_LISTING_SQUARE'
  | 'EBAY_MULTI_ANGLE'
  | 'WOOCOMMERCE_PRODUCT_GALLERY'
  | 'WOOCOMMERCE_THUMBNAIL'
  | 'TRANSPARENT_CUTOUT'
  | 'WHITE_BACKGROUND_JPG';
export type MarketplaceRevisionStatus = 'NONE' | 'REQUESTED' | 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'DELIVERED' | 'CLOSED';

export type MarketplaceExportDefinition = {
  key: MarketplaceExportChannelKey;
  label: string;
  packageKey: RequiredPackageKey;
  defaultPresetKeys: string[];
  defaultImageRoles: MarketplaceImageRole[];
  defaultDeliveryMode: MarketplaceExportDeliveryMode;
  sellerReviewRequired: boolean;
  manualFallbackOnly: boolean;
  supportsCsvImport: boolean;
  supportsApiLater: boolean;
  safeDescription: string;
};

export const MARKETPLACE_EXPORT_SAFE_COPY =
  'ListingLift prepares marketplace image drafts, export-ready file packs, and seller-review recommendations. Review every file against the current marketplace, seller account, category, brand, and product rules before publishing. ListingLift does not guarantee Amazon compliance, eBay compliance, WooCommerce theme approval, marketplace ranking, sales, conversion, ad performance, product approval, or listing approval.';

export const AMAZON_SAFE_COPY =
  'Amazon-ready draft images use white-background and secondary-image formatting patterns for seller review. They are not a guarantee of Amazon approval or category compliance.';

export const EBAY_SAFE_COPY =
  'eBay-ready draft images use clean cutouts, square listing versions, multi-angle naming, compressed JPGs, and SKU folders for seller review. They are not a guarantee of eBay approval, ranking, or sales.';

export const WOOCOMMERCE_SAFE_COPY =
  'WooCommerce-ready draft images are organized for product-gallery import or manual upload. Theme, plugin, store, and merchant review is required before publishing.';

export const MARKETPLACE_EXPORT_SAFETY_RULES = [
  'Use manual workflows, seller-provided exports, CSV imports, official APIs, or approved app integrations only.',
  'Do not scrape Amazon Seller Central, eBay seller tools, WooCommerce admin, private order pages, or seller dashboards.',
  'Do not store marketplace passwords, seller login credentials, or WooCommerce admin passwords.',
  'Do not auto-publish, auto-edit listings, auto-upload images, or auto-message buyers unless an approved integration explicitly permits it and the seller has authorized it.',
  'Keep Amazon, eBay, and WooCommerce outputs as platform-ready drafts with seller review required.',
  'Use external delivery links only where seller workflow and platform rules allow them.',
  'Do not guarantee marketplace compliance, product approval, listing approval, ranking, sales, conversion, or ad performance.',
  'Preserve source attribution, external IDs, SKU data, and revenue attribution for each normalized job.',
] as const;

export const DEFAULT_MARKETPLACE_EXPORT_CHANNELS: MarketplaceExportDefinition[] = [
  {
    key: 'amazon_manual',
    label: 'Amazon Seller Manual / Export',
    packageKey: 'MarketplaceListing50',
    defaultPresetKeys: ['AmazonMainImageDraft', 'AmazonSecondaryImageDraft', 'WhiteJPG', 'TransparentPNG'],
    defaultImageRoles: ['AMAZON_MAIN_IMAGE_DRAFT', 'AMAZON_SECONDARY_IMAGE_DRAFT', 'TRANSPARENT_CUTOUT', 'WHITE_BACKGROUND_JPG'],
    defaultDeliveryMode: 'SELLER_EXPORT_PACKAGE',
    sellerReviewRequired: true,
    manualFallbackOnly: true,
    supportsCsvImport: true,
    supportsApiLater: true,
    safeDescription: AMAZON_SAFE_COPY,
  },
  {
    key: 'ebay_manual',
    label: 'eBay Manual / Export',
    packageKey: 'MarketplaceListing25',
    defaultPresetKeys: ['EbayListingSquare', 'WhiteJPG', 'TransparentPNG'],
    defaultImageRoles: ['EBAY_LISTING_SQUARE', 'EBAY_MULTI_ANGLE', 'WHITE_BACKGROUND_JPG', 'TRANSPARENT_CUTOUT'],
    defaultDeliveryMode: 'SELLER_EXPORT_PACKAGE',
    sellerReviewRequired: true,
    manualFallbackOnly: true,
    supportsCsvImport: true,
    supportsApiLater: true,
    safeDescription: EBAY_SAFE_COPY,
  },
  {
    key: 'woocommerce_manual',
    label: 'WooCommerce Manual / CSV Scaffold',
    packageKey: 'ProductLaunch50',
    defaultPresetKeys: ['WebsiteProductGallery', 'WhiteJPG', 'TransparentPNG'],
    defaultImageRoles: ['WOOCOMMERCE_PRODUCT_GALLERY', 'WOOCOMMERCE_THUMBNAIL', 'WHITE_BACKGROUND_JPG', 'TRANSPARENT_CUTOUT'],
    defaultDeliveryMode: 'DASHBOARD_DOWNLOAD',
    sellerReviewRequired: true,
    manualFallbackOnly: true,
    supportsCsvImport: true,
    supportsApiLater: false,
    safeDescription: WOOCOMMERCE_SAFE_COPY,
  },
];

export function normalizeMarketplaceExportChannelKey(value: string): MarketplaceExportChannelKey {
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, '_');
  const alias: Record<string, MarketplaceExportChannelKey> = {
    amazon: 'amazon_manual',
    amazon_manual: 'amazon_manual',
    amazon_seller: 'amazon_manual',
    amazon_seller_export: 'amazon_manual',
    amazonmanual: 'amazon_manual',
    ebay: 'ebay_manual',
    ebay_manual: 'ebay_manual',
    ebay_export: 'ebay_manual',
    ebaymanual: 'ebay_manual',
    woocommerce: 'woocommerce_manual',
    woo: 'woocommerce_manual',
    woocommerce_manual: 'woocommerce_manual',
    woo_commerce: 'woocommerce_manual',
  };
  const match = alias[normalized];
  if (!match) throw new Error(`Unsupported marketplace export channel: ${value}`);
  return match;
}

export function createMarketplaceExportDedupeKey(input: { organizationId?: string; channelKey: MarketplaceExportChannelKey; storeName?: string; externalReference?: string; sku?: string }) {
  const pieces = [
    input.organizationId ?? 'org',
    input.channelKey,
    input.storeName ?? 'store',
    input.externalReference ?? input.sku ?? 'manual',
  ];
  return pieces.map((piece) => piece.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown').join(':');
}

export function redactMarketplaceBuyer(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.includes('@')) {
    const [name, domain] = trimmed.split('@');
    return `${name.slice(0, 2)}***@${domain ?? 'redacted'}`;
  }
  return trimmed.length <= 3 ? `${trimmed[0] ?? '*'}***` : `${trimmed.slice(0, 3)}***`;
}

export function buildSkuFolderName(input: { channelKey: MarketplaceExportChannelKey; sku?: string; productName?: string }) {
  const prefix = input.channelKey === 'amazon_manual' ? 'Amazon' : input.channelKey === 'ebay_manual' ? 'eBay' : 'WooCommerce';
  const raw = input.sku || input.productName || 'product';
  const safe = raw.trim().replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'product';
  return `${prefix}/by-sku/${safe}`;
}

export function sellerReviewDisclaimer(channelKey: MarketplaceExportChannelKey) {
  if (channelKey === 'amazon_manual') return AMAZON_SAFE_COPY;
  if (channelKey === 'ebay_manual') return EBAY_SAFE_COPY;
  return WOOCOMMERCE_SAFE_COPY;
}

export function getSafeChannelLabel(channelKey: MarketplaceExportChannelKey) {
  if (channelKey === 'amazon_manual') return 'Amazon Seller Manual / Export';
  if (channelKey === 'ebay_manual') return 'eBay Manual / Export';
  return 'WooCommerce Manual / CSV Scaffold';
}
