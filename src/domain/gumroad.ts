import { type RequiredPackageKey } from './database-keys';

export type GumroadOfferKey =
  | 'gumroad_quick_cleanup_10'
  | 'gumroad_quick_cleanup_25'
  | 'gumroad_marketplace_listing_25'
  | 'gumroad_marketplace_listing_50'
  | 'gumroad_monthly_credit_pack'
  | 'gumroad_product_launch_kit'
  | 'gumroad_canva_templates'
  | 'gumroad_listing_optimization_checklist'
  | 'gumroad_ecommerce_image_prep_guide'
  | 'gumroad_dashboard_access'
  | 'gumroad_agency_white_label_starter';

export type GumroadFulfillmentKind = 'IMAGE_PACK_JOB' | 'CREDIT_PACK' | 'DIGITAL_DOWNLOAD' | 'DASHBOARD_ACCESS' | 'AGENCY_STARTER';

export type GumroadPaymentState = 'paid' | 'refunded' | 'disputed' | 'chargeback' | 'test' | 'unknown';

export type GumroadOfferMapping = {
  key: GumroadOfferKey;
  label: string;
  productNameHints: string[];
  permalinkHints: string[];
  packageKey: RequiredPackageKey | null;
  imageAllowance: number | null;
  creditAmount: number;
  revisionAllowance: number;
  fulfillmentKind: GumroadFulfillmentKind;
  createsJob: boolean;
  sendsUploadLink: boolean;
  sendsAdminNotification: boolean;
  safeDescription: string;
};

export const GUMROAD_PROVIDER_KEY = 'gumroad' as const;

export const GUMROAD_SAFE_DELIVERY_CLAIM =
  'Gumroad purchase intake creates a ListingLift fulfillment draft. Outputs are platform-ready drafts and seller review is recommended before publishing. Marketplace approval, ranking, sales, conversion, or ad performance are not guaranteed.';

export const GUMROAD_SUPPORTED_WEBHOOK_EVENTS = ['sale', 'refund', 'subscription_created', 'subscription_updated', 'subscription_cancelled'] as const;

export const DEFAULT_GUMROAD_OFFER_MAPPINGS: GumroadOfferMapping[] = [
  {
    key: 'gumroad_quick_cleanup_10',
    label: '10-image cleanup pack',
    productNameHints: ['10-image cleanup', 'quick cleanup', '10 photo cleanup'],
    permalinkHints: ['quick-cleanup-10', '10-image-cleanup'],
    packageKey: 'QuickCleanup10',
    imageAllowance: 10,
    creditAmount: 0,
    revisionAllowance: 1,
    fulfillmentKind: 'IMAGE_PACK_JOB',
    createsJob: true,
    sendsUploadLink: true,
    sendsAdminNotification: true,
    safeDescription: GUMROAD_SAFE_DELIVERY_CLAIM,
  },
  {
    key: 'gumroad_quick_cleanup_25',
    label: '25-image cleanup pack',
    productNameHints: ['25-image cleanup', '25 photo cleanup'],
    permalinkHints: ['quick-cleanup-25', '25-image-cleanup'],
    packageKey: 'MarketplaceListing25',
    imageAllowance: 25,
    creditAmount: 0,
    revisionAllowance: 1,
    fulfillmentKind: 'IMAGE_PACK_JOB',
    createsJob: true,
    sendsUploadLink: true,
    sendsAdminNotification: true,
    safeDescription: GUMROAD_SAFE_DELIVERY_CLAIM,
  },
  {
    key: 'gumroad_marketplace_listing_25',
    label: 'Marketplace listing pack — 25 images',
    productNameHints: ['marketplace listing 25', 'listing pack 25'],
    permalinkHints: ['marketplace-listing-25'],
    packageKey: 'MarketplaceListing25',
    imageAllowance: 25,
    creditAmount: 0,
    revisionAllowance: 2,
    fulfillmentKind: 'IMAGE_PACK_JOB',
    createsJob: true,
    sendsUploadLink: true,
    sendsAdminNotification: true,
    safeDescription: GUMROAD_SAFE_DELIVERY_CLAIM,
  },
  {
    key: 'gumroad_marketplace_listing_50',
    label: 'Marketplace listing pack — 50 images',
    productNameHints: ['marketplace listing 50', 'listing pack 50'],
    permalinkHints: ['marketplace-listing-50'],
    packageKey: 'MarketplaceListing50',
    imageAllowance: 50,
    creditAmount: 0,
    revisionAllowance: 2,
    fulfillmentKind: 'IMAGE_PACK_JOB',
    createsJob: true,
    sendsUploadLink: true,
    sendsAdminNotification: true,
    safeDescription: GUMROAD_SAFE_DELIVERY_CLAIM,
  },
  {
    key: 'gumroad_monthly_credit_pack',
    label: 'Monthly image cleanup credit pack',
    productNameHints: ['monthly image cleanup credit', 'monthly credits', 'image credits'],
    permalinkHints: ['monthly-image-credits', 'image-cleanup-credits'],
    packageKey: 'MonthlySellerRetainer',
    imageAllowance: null,
    creditAmount: 50,
    revisionAllowance: 2,
    fulfillmentKind: 'CREDIT_PACK',
    createsJob: false,
    sendsUploadLink: false,
    sendsAdminNotification: true,
    safeDescription: 'Applies image cleanup credits for future ListingLift jobs. Credits do not guarantee platform approval or sales outcomes.',
  },
  {
    key: 'gumroad_product_launch_kit',
    label: 'Product launch image kit',
    productNameHints: ['product launch image kit', 'launch image kit'],
    permalinkHints: ['product-launch-image-kit'],
    packageKey: 'ProductLaunch50',
    imageAllowance: 50,
    creditAmount: 0,
    revisionAllowance: 3,
    fulfillmentKind: 'IMAGE_PACK_JOB',
    createsJob: true,
    sendsUploadLink: true,
    sendsAdminNotification: true,
    safeDescription: GUMROAD_SAFE_DELIVERY_CLAIM,
  },
  {
    key: 'gumroad_canva_templates',
    label: 'Canva product image templates',
    productNameHints: ['canva product image templates', 'canva templates'],
    permalinkHints: ['canva-product-image-templates'],
    packageKey: null,
    imageAllowance: null,
    creditAmount: 0,
    revisionAllowance: 0,
    fulfillmentKind: 'DIGITAL_DOWNLOAD',
    createsJob: false,
    sendsUploadLink: false,
    sendsAdminNotification: false,
    safeDescription: 'Digital template purchase. No ListingLift fulfillment job is created unless manually upgraded.',
  },
  {
    key: 'gumroad_listing_optimization_checklist',
    label: 'Listing optimization checklist',
    productNameHints: ['listing optimization checklist', 'optimization checklist'],
    permalinkHints: ['listing-optimization-checklist'],
    packageKey: null,
    imageAllowance: null,
    creditAmount: 0,
    revisionAllowance: 0,
    fulfillmentKind: 'DIGITAL_DOWNLOAD',
    createsJob: false,
    sendsUploadLink: false,
    sendsAdminNotification: false,
    safeDescription: 'Digital checklist purchase. No sales, ranking, marketplace approval, or conversion result is guaranteed.',
  },
  {
    key: 'gumroad_ecommerce_image_prep_guide',
    label: 'Ecommerce image prep guide',
    productNameHints: ['ecommerce image prep guide', 'image prep guide'],
    permalinkHints: ['ecommerce-image-prep-guide'],
    packageKey: null,
    imageAllowance: null,
    creditAmount: 0,
    revisionAllowance: 0,
    fulfillmentKind: 'DIGITAL_DOWNLOAD',
    createsJob: false,
    sendsUploadLink: false,
    sendsAdminNotification: false,
    safeDescription: 'Educational guide purchase. Review current marketplace guidelines before publishing images.',
  },
  {
    key: 'gumroad_dashboard_access',
    label: 'Dashboard access',
    productNameHints: ['dashboard access', 'listinglift dashboard'],
    permalinkHints: ['dashboard-access'],
    packageKey: 'MonthlySellerRetainer',
    imageAllowance: null,
    creditAmount: 0,
    revisionAllowance: 0,
    fulfillmentKind: 'DASHBOARD_ACCESS',
    createsJob: false,
    sendsUploadLink: false,
    sendsAdminNotification: true,
    safeDescription: 'Dashboard access purchase. Access must be granted server-side after verified payment.',
  },
  {
    key: 'gumroad_agency_white_label_starter',
    label: 'Agency white-label starter package',
    productNameHints: ['agency white-label starter', 'white label starter'],
    permalinkHints: ['agency-white-label-starter'],
    packageKey: 'AgencyWhiteLabel',
    imageAllowance: null,
    creditAmount: 0,
    revisionAllowance: 3,
    fulfillmentKind: 'AGENCY_STARTER',
    createsJob: false,
    sendsUploadLink: false,
    sendsAdminNotification: true,
    safeDescription: 'Agency onboarding purchase. White-label access requires admin review and setup.',
  },
];

export function normalizeGumroadText(value: unknown) {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function buildGumroadDedupeKey(saleId: string, productId?: string | null) {
  const productPart = productId ? productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60) : 'unknown-product';
  return `gumroad:${productPart}:${saleId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80)}`;
}

export function redactGumroadEmail(email: string | null | undefined) {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!domain) return 'redacted';
  return `${name.slice(0, 2)}***@${domain}`;
}

export function isGumroadRefunded(input: { refunded?: unknown; chargebacked?: unknown; disputed?: unknown; dispute_won?: unknown }) {
  return input.refunded === true || input.chargebacked === true || input.disputed === true || input.dispute_won === false;
}
