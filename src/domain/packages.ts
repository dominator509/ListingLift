import { REQUIRED_PACKAGE_KEYS, type RequiredPackageKey } from './database-keys';

export type BillingInterval = 'one_time' | 'month' | 'volume' | 'custom' | null;

export type PackageCategory = 'quick_cleanup' | 'marketplace_listing' | 'product_launch' | 'retainer' | 'agency' | 'custom';

export type PackageCheckoutMode = 'direct_checkout' | 'manual_quote' | 'subscription_inquiry' | 'volume_quote';

export type PackagePricePolicy = {
  baseImageAllowance: number | null;
  overagePriceCents: number | null;
  rushAvailable: boolean;
  rushFeeCents: number | null;
  requiresManualQuoteAboveImages: number | null;
};

export type ServicePackage = {
  key: RequiredPackageKey;
  publicSlug: string;
  name: string;
  shortName: string;
  category: PackageCategory;
  description: string;
  positioning: string;
  imageMin: number | null;
  imageMax: number | null;
  imageAllowance: number | null;
  priceMinCents: number | null;
  priceMaxCents: number | null;
  currency: 'USD';
  billingInterval: BillingInterval;
  checkoutMode: PackageCheckoutMode;
  deliveryWindowDays: number | null;
  revisionAllowance: number;
  includedOutputTypes: string[];
  defaultSalesChannelKeys: string[];
  features: string[];
  recommendedFor: string[];
  deliverables: string[];
  pricePolicy: PackagePricePolicy;
  safeClaim: string;
  upsellPackageKeys: RequiredPackageKey[];
  popular: boolean;
  sortOrder: number;
  active: boolean;
  manualReviewRequired: boolean;
};

export const PACKAGE_SAFE_CLAIM = 'Formatted as platform-ready drafts. Seller review against current platform guidelines is recommended before publishing. Marketplace approval, ranking, sales, or ad performance are not guaranteed.';

export const DEFAULT_PACKAGES: ServicePackage[] = [
  {
    key: 'QuickCleanup10',
    publicSlug: 'quick-cleanup-pack',
    name: 'Quick Cleanup Pack',
    shortName: 'Quick Cleanup',
    category: 'quick_cleanup',
    description: '10-image cleanup pack with background removal, white JPG, transparent PNG, basic crop/resize, and ZIP delivery.',
    positioning: 'Best for small sellers who need a fast cleanup pass on a limited batch of product photos.',
    imageMin: 10,
    imageMax: 10,
    imageAllowance: 10,
    priceMinCents: 2500,
    priceMaxCents: 4900,
    currency: 'USD',
    billingInterval: 'one_time',
    checkoutMode: 'direct_checkout',
    deliveryWindowDays: 3,
    revisionAllowance: 1,
    includedOutputTypes: ['TRANSPARENT_PNG', 'WHITE_JPG', 'ZIP'],
    defaultSalesChannelKeys: ['Direct', 'Stripe', 'Gumroad', 'Fiverr'],
    features: ['Background removal', 'White JPG', 'Transparent PNG', 'Basic crop/resize', 'ZIP delivery'],
    recommendedFor: ['Marketplace starter sellers', 'Local businesses', 'One-off listing cleanup'],
    deliverables: ['Transparent PNG files', 'White-background JPG files', 'Basic crop/resize pass', 'ZIP delivery folder'],
    pricePolicy: { baseImageAllowance: 10, overagePriceCents: 500, rushAvailable: false, rushFeeCents: null, requiresManualQuoteAboveImages: 15 },
    safeClaim: PACKAGE_SAFE_CLAIM,
    upsellPackageKeys: ['MarketplaceListing25', 'MonthlySellerRetainer'],
    popular: false,
    sortOrder: 10,
    active: true,
    manualReviewRequired: false,
  },
  {
    key: 'MarketplaceListing25',
    publicSlug: 'marketplace-listing-pack-25',
    name: 'Marketplace Listing Pack — 25 Images',
    shortName: 'Marketplace 25',
    category: 'marketplace_listing',
    description: '25-image marketplace draft pack with platform resizing, transparent PNG, white JPG, soft shadow, SKU naming, platform folders, and ZIP delivery.',
    positioning: 'Best for sellers preparing a focused marketplace catalog refresh across Amazon, Etsy, eBay, Shopify, TikTok Shop, or social channels.',
    imageMin: 25,
    imageMax: 25,
    imageAllowance: 25,
    priceMinCents: 9900,
    priceMaxCents: 14900,
    currency: 'USD',
    billingInterval: 'one_time',
    checkoutMode: 'direct_checkout',
    deliveryWindowDays: 5,
    revisionAllowance: 2,
    includedOutputTypes: ['TRANSPARENT_PNG', 'WHITE_JPG', 'SQUARE_ECOMMERCE', 'ZIP', 'MANIFEST'],
    defaultSalesChannelKeys: ['Direct', 'Stripe', 'Gumroad', 'Fiverr', 'Upwork'],
    features: ['Marketplace resizing', 'Transparent PNG', 'White JPG', 'Soft shadow', 'Square listing images', 'SKU/product file naming', 'Platform-specific folders', 'ZIP delivery'],
    recommendedFor: ['Amazon/Etsy/eBay sellers', 'Shopify sellers', 'TikTok Shop sellers', 'SKU-based catalog cleanup'],
    deliverables: ['Transparent PNG files', 'White JPG files', 'Square listing images', 'Platform-specific folders', 'Manifest CSV', 'ZIP delivery'],
    pricePolicy: { baseImageAllowance: 25, overagePriceCents: 600, rushAvailable: true, rushFeeCents: 4900, requiresManualQuoteAboveImages: 35 },
    safeClaim: PACKAGE_SAFE_CLAIM,
    upsellPackageKeys: ['MarketplaceListing50', 'ProductLaunch50', 'MonthlySellerRetainer'],
    popular: true,
    sortOrder: 20,
    active: true,
    manualReviewRequired: false,
  },
  {
    key: 'MarketplaceListing50',
    publicSlug: 'marketplace-listing-pack-50',
    name: 'Marketplace Listing Pack — 50 Images',
    shortName: 'Marketplace 50',
    category: 'marketplace_listing',
    description: '50-image marketplace draft pack for larger catalogs needing organized platform-ready drafts and delivery folders.',
    positioning: 'Best for larger product batches where file naming, platform folders, and consistent output structure matter.',
    imageMin: 50,
    imageMax: 50,
    imageAllowance: 50,
    priceMinCents: 14900,
    priceMaxCents: 24900,
    currency: 'USD',
    billingInterval: 'one_time',
    checkoutMode: 'direct_checkout',
    deliveryWindowDays: 7,
    revisionAllowance: 2,
    includedOutputTypes: ['TRANSPARENT_PNG', 'WHITE_JPG', 'SQUARE_ECOMMERCE', 'ZIP', 'MANIFEST'],
    defaultSalesChannelKeys: ['Direct', 'Stripe', 'Gumroad', 'Fiverr', 'Upwork'],
    features: ['Marketplace resizing', 'Platform folders', 'SKU naming', 'Manifest', 'ZIP delivery'],
    recommendedFor: ['Catalog refreshes', 'Multi-SKU marketplace sellers', 'Agencies fulfilling smaller client batches'],
    deliverables: ['Transparent PNG files', 'White JPG files', 'Marketplace square drafts', 'Manifest CSV', 'Platform folder ZIP'],
    pricePolicy: { baseImageAllowance: 50, overagePriceCents: 500, rushAvailable: true, rushFeeCents: 7900, requiresManualQuoteAboveImages: 70 },
    safeClaim: PACKAGE_SAFE_CLAIM,
    upsellPackageKeys: ['ProductLaunch100', 'MonthlySellerRetainer', 'AgencyWhiteLabel'],
    popular: false,
    sortOrder: 30,
    active: true,
    manualReviewRequired: false,
  },
  {
    key: 'ProductLaunch50',
    publicSlug: 'product-launch-image-pack-50',
    name: 'Product Launch Image Pack — 50 Images',
    shortName: 'Launch 50',
    category: 'product_launch',
    description: '50-image launch pack with ecommerce, hero, social-commerce, ad-ready, thumbnail, and report deliverables.',
    positioning: 'Best for founders and ecommerce teams preparing a new product launch with multiple visual use cases.',
    imageMin: 50,
    imageMax: 50,
    imageAllowance: 50,
    priceMinCents: 29900,
    priceMaxCents: 49900,
    currency: 'USD',
    billingInterval: 'one_time',
    checkoutMode: 'manual_quote',
    deliveryWindowDays: 10,
    revisionAllowance: 3,
    includedOutputTypes: ['TRANSPARENT_PNG', 'WHITE_JPG', 'HERO_IMAGE', 'VERTICAL_SOCIAL', 'THUMBNAIL', 'REPORT', 'ZIP'],
    defaultSalesChannelKeys: ['Direct', 'Stripe', 'Upwork', 'Contra'],
    features: ['Brand-color backgrounds', 'Hero images', 'Social-commerce variations', 'Ad-ready variations', 'Product sequence recommendations', 'Image quality report'],
    recommendedFor: ['Product launch founders', 'Shopify launches', 'Gumroad/offer launches', 'Social-commerce campaigns'],
    deliverables: ['Transparent cutouts', 'White-background listing drafts', 'Hero image drafts', 'Social-commerce variations', 'Ad-ready variations', 'Image quality report'],
    pricePolicy: { baseImageAllowance: 50, overagePriceCents: 900, rushAvailable: true, rushFeeCents: 14900, requiresManualQuoteAboveImages: 65 },
    safeClaim: PACKAGE_SAFE_CLAIM,
    upsellPackageKeys: ['ProductLaunch100', 'MonthlySellerRetainer', 'AgencyWhiteLabel'],
    popular: false,
    sortOrder: 40,
    active: true,
    manualReviewRequired: true,
  },
  {
    key: 'ProductLaunch100',
    publicSlug: 'product-launch-image-pack-100',
    name: 'Product Launch Image Pack — 100 Images',
    shortName: 'Launch 100',
    category: 'product_launch',
    description: '100-image launch pack for larger product drops with ecommerce, social, ad, thumbnail, and quality-report outputs.',
    positioning: 'Best for full product drops, larger launch catalogs, or high-volume founders needing a complete image set.',
    imageMin: 100,
    imageMax: 100,
    imageAllowance: 100,
    priceMinCents: 49900,
    priceMaxCents: 79900,
    currency: 'USD',
    billingInterval: 'one_time',
    checkoutMode: 'manual_quote',
    deliveryWindowDays: 14,
    revisionAllowance: 3,
    includedOutputTypes: ['TRANSPARENT_PNG', 'WHITE_JPG', 'HERO_IMAGE', 'VERTICAL_SOCIAL', 'THUMBNAIL', 'REPORT', 'ZIP'],
    defaultSalesChannelKeys: ['Direct', 'Stripe', 'Upwork', 'Contra'],
    features: ['Large launch batch', 'Platform folders', 'Ad creative drafts', 'Report', 'ZIP delivery'],
    recommendedFor: ['Larger product launches', 'Crowdfunding/catalog launches', 'Ecommerce teams', 'Agency launch clients'],
    deliverables: ['Transparent cutouts', 'Listing drafts', 'Hero and social variations', 'Ad-ready image drafts', 'Thumbnail variations', 'Quality report', 'ZIP delivery'],
    pricePolicy: { baseImageAllowance: 100, overagePriceCents: 800, rushAvailable: true, rushFeeCents: 24900, requiresManualQuoteAboveImages: 125 },
    safeClaim: PACKAGE_SAFE_CLAIM,
    upsellPackageKeys: ['MonthlySellerRetainer', 'AgencyWhiteLabel'],
    popular: false,
    sortOrder: 50,
    active: true,
    manualReviewRequired: true,
  },
  {
    key: 'MonthlySellerRetainer',
    publicSlug: 'monthly-seller-image-retainer',
    name: 'Monthly Seller Image Retainer',
    shortName: 'Seller Retainer',
    category: 'retainer',
    description: 'Ongoing monthly fulfillment with image allowance, priority turnaround, reports, dashboard access, revisions, and archive.',
    positioning: 'Best for sellers who add products monthly and want recurring image cleanup capacity.',
    imageMin: null,
    imageMax: null,
    imageAllowance: null,
    priceMinCents: 19900,
    priceMaxCents: 99900,
    currency: 'USD',
    billingInterval: 'month',
    checkoutMode: 'subscription_inquiry',
    deliveryWindowDays: null,
    revisionAllowance: 4,
    includedOutputTypes: ['TRANSPARENT_PNG', 'WHITE_JPG', 'SQUARE_ECOMMERCE', 'REPORT', 'ZIP'],
    defaultSalesChannelKeys: ['Direct', 'Stripe', 'Upwork'],
    features: ['Monthly image allowance', 'Priority turnaround', 'Monthly image cleanup report', 'Dashboard access', 'Revision allowance', 'Image archive', 'Refresh recommendations'],
    recommendedFor: ['Ongoing sellers', 'Restaurants refreshing menu photos', 'Shopify stores', 'Marketplace stores with repeat uploads'],
    deliverables: ['Monthly allowance', 'Priority queue', 'Monthly cleanup report', 'Image archive', 'Dashboard access', 'Revision allowance'],
    pricePolicy: { baseImageAllowance: null, overagePriceCents: null, rushAvailable: false, rushFeeCents: null, requiresManualQuoteAboveImages: null },
    safeClaim: PACKAGE_SAFE_CLAIM,
    upsellPackageKeys: ['AgencyWhiteLabel'],
    popular: false,
    sortOrder: 60,
    active: true,
    manualReviewRequired: true,
  },
  {
    key: 'AgencyWhiteLabel',
    publicSlug: 'agency-white-label-image-fulfillment',
    name: 'Agency White-Label Image Fulfillment',
    shortName: 'Agency White-Label',
    category: 'agency',
    description: 'Agency fulfillment workspace with multiple client workspaces, branded delivery, reports, priority queue, custom presets, and volume billing support.',
    positioning: 'Best for agencies that want to resell image fulfillment under their own brand with multiple client workspaces.',
    imageMin: null,
    imageMax: null,
    imageAllowance: null,
    priceMinCents: 100000,
    priceMaxCents: 300000,
    currency: 'USD',
    billingInterval: 'volume',
    checkoutMode: 'volume_quote',
    deliveryWindowDays: null,
    revisionAllowance: 6,
    includedOutputTypes: ['TRANSPARENT_PNG', 'WHITE_JPG', 'SQUARE_ECOMMERCE', 'VERTICAL_SOCIAL', 'REPORT', 'ZIP'],
    defaultSalesChannelKeys: ['Direct', 'Stripe', 'Upwork', 'Contra'],
    features: ['Multiple client workspaces', 'Branded delivery', 'Bulk processing', 'White-label reports', 'Client portal', 'Agency dashboard', 'Custom export presets', 'Multi-client billing support'],
    recommendedFor: ['Creative agencies', 'Marketplace service providers', 'Ecommerce agencies', 'White-label fulfillment resellers'],
    deliverables: ['Agency dashboard', 'Multiple client workspaces', 'Branded delivery scaffold', 'White-label reports', 'Priority queue', 'Volume pricing workflow'],
    pricePolicy: { baseImageAllowance: null, overagePriceCents: null, rushAvailable: false, rushFeeCents: null, requiresManualQuoteAboveImages: null },
    safeClaim: PACKAGE_SAFE_CLAIM,
    upsellPackageKeys: ['Custom'],
    popular: false,
    sortOrder: 70,
    active: true,
    manualReviewRequired: true,
  },
  {
    key: 'Custom',
    publicSlug: 'custom-image-fulfillment',
    name: 'Custom Image Fulfillment',
    shortName: 'Custom',
    category: 'custom',
    description: 'Manual quote package for unusual file volume, platform requirements, or white-label workflow needs.',
    positioning: 'Best for unusual image volumes, custom marketplaces, complex brand requirements, or non-standard delivery workflows.',
    imageMin: null,
    imageMax: null,
    imageAllowance: null,
    priceMinCents: null,
    priceMaxCents: null,
    currency: 'USD',
    billingInterval: 'custom',
    checkoutMode: 'manual_quote',
    deliveryWindowDays: null,
    revisionAllowance: 0,
    includedOutputTypes: ['CUSTOM'],
    defaultSalesChannelKeys: ['Direct'],
    features: ['Custom scope', 'Manual review', 'Custom delivery plan'],
    recommendedFor: ['Non-standard marketplace work', 'Large manual imports', 'Custom delivery requirements'],
    deliverables: ['Manual estimate', 'Custom fulfillment plan', 'Operator-reviewed scope'],
    pricePolicy: { baseImageAllowance: null, overagePriceCents: null, rushAvailable: false, rushFeeCents: null, requiresManualQuoteAboveImages: null },
    safeClaim: PACKAGE_SAFE_CLAIM,
    upsellPackageKeys: [],
    popular: false,
    sortOrder: 80,
    active: true,
    manualReviewRequired: true,
  },
];

const defaultPackageKeySet = new Set(DEFAULT_PACKAGES.map((pkg) => pkg.key));
export const MISSING_DEFAULT_PACKAGE_KEYS = REQUIRED_PACKAGE_KEYS.filter((key) => !defaultPackageKeySet.has(key));

export const DEFAULT_PUBLIC_PACKAGE_KEYS = DEFAULT_PACKAGES.filter((pkg) => pkg.active && pkg.key !== 'Custom').map((pkg) => pkg.key);

export function findDefaultPackage(keyOrSlug: string) {
  return DEFAULT_PACKAGES.find((pkg) => pkg.key === keyOrSlug || pkg.publicSlug === keyOrSlug) ?? null;
}

export function formatPackagePrice(pkg: Pick<ServicePackage, 'priceMinCents' | 'priceMaxCents' | 'billingInterval'>) {
  const money = (cents: number | null) => (cents == null ? 'Custom' : `$${Math.round(cents / 100).toLocaleString()}`);
  if (pkg.priceMinCents == null && pkg.priceMaxCents == null) return 'Custom quote';
  const range = pkg.priceMaxCents && pkg.priceMaxCents !== pkg.priceMinCents ? `${money(pkg.priceMinCents)}–${money(pkg.priceMaxCents)}` : money(pkg.priceMinCents);
  if (pkg.billingInterval === 'month') return `${range}/month`;
  if (pkg.billingInterval === 'volume') return `${range}/month or volume pricing`;
  return range;
}
