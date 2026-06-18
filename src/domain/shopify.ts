import { type RequiredPackageKey } from './database-keys';

export type ShopifySourceMode = 'MANUAL' | 'CSV_IMPORT' | 'API_SCAFFOLD' | 'OAUTH_APP_SCAFFOLD' | 'WEBHOOK_SCAFFOLD';
export type ShopifyWorkflowStatus =
  | 'DRAFT'
  | 'STORE_CAPTURED'
  | 'PRODUCT_EXPORT_NEEDED'
  | 'PRODUCT_CSV_IMPORTED'
  | 'FILES_NEEDED'
  | 'FILES_RECEIVED'
  | 'PROCESSING'
  | 'WAITING_FOR_QC'
  | 'WAITING_FOR_APPROVAL'
  | 'REPLACEMENT_APPROVAL_NEEDED'
  | 'DELIVERY_READY'
  | 'DELIVERED_TO_MERCHANT'
  | 'REVISION_REQUESTED'
  | 'STORE_REFRESH_UPSELL_READY'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';
export type ShopifyProductImportMode = 'MANUAL_CSV' | 'PRODUCT_EXPORT_CSV' | 'API_SCAFFOLD' | 'OAUTH_APP_SCAFFOLD';
export type ShopifyDeliveryMode = 'SHOPIFY_ADMIN_MANUAL_UPLOAD' | 'SHOPIFY_FILE_IMPORT_GUIDE' | 'EMAIL_WITH_ALLOWED_LINK' | 'MANUAL_EXTERNAL_DELIVERY_RECORDED';
export type ShopifyImageReplacementApprovalStatus = 'NOT_REQUESTED' | 'PENDING_MERCHANT_REVIEW' | 'APPROVED_FOR_MANUAL_UPLOAD' | 'REJECTED' | 'REPLACED_MANUALLY' | 'CLOSED';
export type ShopifyOAuthStatus = 'NOT_CONFIGURED' | 'SCAFFOLD_ONLY' | 'PENDING_APP_REVIEW' | 'CONNECTED_TEST_STORE' | 'CONNECTED_PRODUCTION_STORE' | 'DISABLED';
export type ShopifyAuditSectionKey = 'PRODUCT_GALLERY_SEQUENCE' | 'CONSISTENCY_SCORE' | 'THUMBNAIL_CROPS' | 'BACKGROUND_CONSISTENCY' | 'STORE_REFRESH_UPSELL' | 'MERCHANT_REVIEW_CHECKLIST';

export type ShopifyImagePackDefinition = {
  key: string;
  title: string;
  packageKey: RequiredPackageKey;
  imageAllowance: number;
  revisionAllowance: number;
  defaultPresetKeys: string[];
  defaultDeliveryMode: ShopifyDeliveryMode;
  supportsCsvImport: boolean;
  supportsOauthScaffold: boolean;
  includesStorefrontAudit: boolean;
  includesReplacementApproval: boolean;
  safeDescription: string;
};

export const SHOPIFY_CHANNEL_KEY = 'Shopify' as const;
export const SHOPIFY_DEFAULT_PRESET_KEYS = ['ShopifyProductImage', 'WebsiteProductGallery', 'InstagramSquare'] as const;

export const SHOPIFY_SAFE_COPY =
  'ListingLift prepares Shopify-formatted product-gallery image drafts, clean background versions, organized product/SKU folders, and storefront visual notes for merchant review. Review all files against current Shopify theme, app, marketplace, and brand requirements before publishing. Shopify approval, product approval, ranking, traffic, sales, conversion, ad performance, or listing approval are not guaranteed.';

export const SHOPIFY_MARKETPLACE_SAFETY_RULES = [
  'Use Shopify OAuth, scoped API access, approved webhooks, CSV exports/imports, or manual workflows only.',
  'Do not scrape private Shopify admin pages, orders, customers, analytics, files, or product data.',
  'Do not store Shopify passwords or merchant staff credentials.',
  'Store OAuth access tokens only through encrypted secret storage and never expose them to the frontend.',
  'Do not automatically replace product images without explicit merchant approval and scoped integration authorization.',
  'Keep manual product image replacement as the baseline workflow until a Shopify app is approved and feature-flagged.',
  'Use external download links only when the merchant context allows them.',
  'Do not guarantee Shopify approval, marketplace ranking, traffic, sales, conversion increases, ad performance, product approval, or listing approval.',
  'Store only minimal product, SKU, store, revenue, and fulfillment attribution needed for ListingLift operations.',
] as const;

export const DEFAULT_SHOPIFY_IMAGE_PACKS: ShopifyImagePackDefinition[] = [
  {
    key: 'shopify-gallery-cleanup',
    title: 'Shopify Gallery Cleanup',
    packageKey: 'MarketplaceListing25',
    imageAllowance: 25,
    revisionAllowance: 2,
    defaultPresetKeys: ['ShopifyProductImage', 'WebsiteProductGallery'],
    defaultDeliveryMode: 'SHOPIFY_FILE_IMPORT_GUIDE',
    supportsCsvImport: true,
    supportsOauthScaffold: false,
    includesStorefrontAudit: false,
    includesReplacementApproval: true,
    safeDescription: SHOPIFY_SAFE_COPY,
  },
  {
    key: 'shopify-launch-pack',
    title: 'Shopify Product Launch Pack',
    packageKey: 'ProductLaunch100',
    imageAllowance: 100,
    revisionAllowance: 3,
    defaultPresetKeys: ['ShopifyProductImage', 'WebsiteProductGallery', 'InstagramSquare', 'InstagramStoryReelVertical'],
    defaultDeliveryMode: 'SHOPIFY_FILE_IMPORT_GUIDE',
    supportsCsvImport: true,
    supportsOauthScaffold: true,
    includesStorefrontAudit: true,
    includesReplacementApproval: true,
    safeDescription: SHOPIFY_SAFE_COPY,
  },
  {
    key: 'shopify-monthly-refresh',
    title: 'Shopify Monthly Image Refresh',
    packageKey: 'MonthlySellerRetainer',
    imageAllowance: 150,
    revisionAllowance: 4,
    defaultPresetKeys: ['ShopifyProductImage', 'WebsiteProductGallery', 'InstagramSquare', 'PinterestPin'],
    defaultDeliveryMode: 'SHOPIFY_FILE_IMPORT_GUIDE',
    supportsCsvImport: true,
    supportsOauthScaffold: true,
    includesStorefrontAudit: true,
    includesReplacementApproval: true,
    safeDescription: SHOPIFY_SAFE_COPY,
  },
];

export function normalizeShopifyStoreDomain(storeDomain: string) {
  return storeDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/[^a-z0-9.-]+/g, '-').replace(/^-|-$/g, '');
}

export function normalizeShopifyProductId(productId: string) {
  return productId.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '');
}

export function normalizeShopifySku(value?: string) {
  if (!value) return undefined;
  const clean = value.trim().toUpperCase().replace(/[^A-Z0-9_-]+/g, '-').replace(/^-|-$/g, '');
  return clean || undefined;
}

export function buildShopifyDedupeKey(input: { organizationId?: string; storeDomain: string; productId?: string; sku?: string; externalOrderId?: string }) {
  const org = input.organizationId ? `${input.organizationId}:` : '';
  const store = normalizeShopifyStoreDomain(input.storeDomain || 'unknown-store');
  const product = input.productId ? normalizeShopifyProductId(input.productId) : undefined;
  const sku = normalizeShopifySku(input.sku);
  const ref = input.externalOrderId ? normalizeShopifyProductId(input.externalOrderId) : product ?? sku ?? 'manual-batch';
  return `${org}shopify:${store}:${ref}`;
}

export function redactShopifyMerchant(value?: string) {
  if (!value) return undefined;
  const clean = value.trim();
  if (!clean) return undefined;
  if (clean.includes('@')) {
    const [local, domain] = clean.split('@');
    return `${local.slice(0, 1)}***@${domain}`;
  }
  if (clean.length <= 2) return '**';
  return `${clean.slice(0, 1)}***${clean.slice(-1)}`;
}

export function buildShopifyDeliveryMessage(input: { merchantName?: string; archiveName?: string; includeExternalLink?: boolean; externalLinkAllowed?: boolean; storeDomain?: string }) {
  const greeting = input.merchantName ? `Hi ${input.merchantName},` : 'Hi,';
  const archive = input.archiveName ?? 'your ListingLift Shopify image pack';
  const store = input.storeDomain ? ` for ${normalizeShopifyStoreDomain(input.storeDomain)}` : '';
  const linkLine = input.includeExternalLink && input.externalLinkAllowed
    ? 'I can provide the secure download link if this merchant context permits external delivery links.'
    : 'I can deliver the final files through the approved manual Shopify delivery path for this project.';
  return `${greeting}\n\n${archive}${store} is prepared as Shopify-formatted product image drafts for merchant review. The pack may include product/SKU folders, Shopify product-gallery images, clean-background JPGs, transparent PNG cutouts, social-commerce variants, a manifest, and merchant-review notes. ${linkLine}\n\nPlease review all files against your current Shopify theme, brand standards, apps, and publishing requirements before replacing live product images. Shopify approval, product approval, ranking, traffic, sales, conversion, ad performance, or listing approval are not guaranteed.`;
}

export function buildShopifyProductPageAudit(input: { productTitles?: string[]; flaggedIssues?: string[]; recommendedSequence?: string[]; consistencyScore?: number }) {
  const score = typeof input.consistencyScore === 'number' ? Math.max(0, Math.min(100, Math.round(input.consistencyScore))) : 78;
  return {
    score,
    sections: [
      { key: 'PRODUCT_GALLERY_SEQUENCE' as ShopifyAuditSectionKey, title: 'Suggested product gallery sequence', notes: input.recommendedSequence?.length ? input.recommendedSequence : ['Primary product image', 'Alternate angle', 'Detail close-up', 'Scale/context image', 'Transparent cutout where useful'] },
      { key: 'CONSISTENCY_SCORE' as ShopifyAuditSectionKey, title: 'Storefront image consistency score', notes: [`Draft consistency score: ${score}/100. Merchant review recommended before publishing.`] },
      { key: 'THUMBNAIL_CROPS' as ShopifyAuditSectionKey, title: 'Thumbnail and crop notes', notes: input.productTitles?.length ? input.productTitles.map((title) => `Review ${title} for consistent product scale, crop, and gallery framing.`) : ['Review product crop and scale across the product grid and product page gallery.'] },
      { key: 'BACKGROUND_CONSISTENCY' as ShopifyAuditSectionKey, title: 'Background consistency notes', notes: input.flaggedIssues?.length ? input.flaggedIssues : ['Review background color, edge quality, shadows, and compression before publishing.'] },
      { key: 'STORE_REFRESH_UPSELL' as ShopifyAuditSectionKey, title: 'Refresh opportunity', notes: ['Consider refreshing older product images to match the new product-gallery standard.'] },
    ],
    safeCopy: SHOPIFY_SAFE_COPY,
  };
}

export function buildShopifyProductFolderPath(input: { sku?: string; productId?: string; title?: string }) {
  const sku = normalizeShopifySku(input.sku);
  const product = input.productId ? normalizeShopifyProductId(input.productId) : undefined;
  const title = input.title ? input.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : undefined;
  return `Shopify/product-gallery/${sku ?? product ?? title ?? 'unmapped-product'}`;
}

export function isUnsafeShopifyAction(action: string) {
  const lower = action.toLowerCase();
  return [
    'scrape',
    'password',
    'admin password',
    'staff account password',
    'private admin scraping',
    'customer export scraping',
    'auto replace image',
    'automatic replacement without approval',
    'auto publish',
    'theme edit without approval',
    'unauthorized app install',
  ].some((needle) => lower.includes(needle));
}
