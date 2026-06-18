import { type RequiredPackageKey } from './database-keys';

export type FiverrGigTierKey =
  | 'fiverr_basic_10_cleanup'
  | 'fiverr_standard_25_marketplace'
  | 'fiverr_premium_50_marketplace'
  | 'fiverr_product_launch_50'
  | 'fiverr_monthly_seller_retainer'
  | 'fiverr_agency_white_label';

export type FiverrWorkflowStatus =
  | 'DRAFT'
  | 'ORDER_CAPTURED'
  | 'FILES_NEEDED'
  | 'FILES_RECEIVED'
  | 'PROCESSING'
  | 'WAITING_FOR_REVIEW'
  | 'FLAGGED'
  | 'APPROVED'
  | 'DELIVERY_READY'
  | 'DELIVERED_IN_FIVERR'
  | 'REVISION_REQUESTED'
  | 'REPROCESSING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export type FiverrDeliveryMode = 'FIVERR_ATTACHMENT' | 'FIVERR_MESSAGE_WITH_ALLOWED_LINK' | 'MANUAL_EXTERNAL_DELIVERY_RECORDED';
export type FiverrRevisionStatus = 'NONE' | 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'DELIVERED' | 'CLOSED';

export type FiverrGigMapping = {
  key: FiverrGigTierKey;
  gigTitle: string;
  searchHints: string[];
  packageKey: RequiredPackageKey;
  imageAllowance: number;
  revisionAllowance: number;
  defaultTurnaroundDays: number;
  deliveryMode: FiverrDeliveryMode;
  createsUploadLink: boolean;
  deliveryTemplateKey: string;
  active: boolean;
  safeDescription: string;
};

export const FIVERR_PROVIDER_KEY = 'fiverr' as const;

export const FIVERR_MARKETPLACE_SAFETY_RULES = [
  'Do not scrape private Fiverr pages.',
  'Do not store Fiverr passwords or buyer private messages outside necessary order metadata.',
  'Do not automate buyer messaging unless Fiverr explicitly permits the automation path.',
  'Prefer manual order entry, CSV import, or approved integration modes.',
  'Keep final delivery inside Fiverr when Fiverr rules require it.',
  'Use external links only when allowed by Fiverr and the buyer/order context.',
  'Keep order source attribution for revenue tracking and support.',
  'Never guarantee marketplace approval, ranking, sales, conversion, or ad performance.',
] as const;

export const FIVERR_SAFE_DELIVERY_LANGUAGE =
  'Your ListingLift image pack is prepared as platform-ready draft files. Please review the images and your current marketplace guidelines before publishing. Marketplace approval, ranking, sales, conversion, or advertising results are not guaranteed.';

export const DEFAULT_FIVERR_GIG_MAPPINGS: FiverrGigMapping[] = [
  {
    key: 'fiverr_basic_10_cleanup',
    gigTitle: 'Basic product photo background cleanup — 10 images',
    searchHints: ['basic', '10 images', 'background cleanup', 'quick cleanup'],
    packageKey: 'QuickCleanup10',
    imageAllowance: 10,
    revisionAllowance: 1,
    defaultTurnaroundDays: 2,
    deliveryMode: 'FIVERR_ATTACHMENT',
    createsUploadLink: true,
    deliveryTemplateKey: 'fiverr_delivery_basic_cleanup',
    active: true,
    safeDescription: FIVERR_SAFE_DELIVERY_LANGUAGE,
  },
  {
    key: 'fiverr_standard_25_marketplace',
    gigTitle: 'Standard marketplace product image pack — 25 images',
    searchHints: ['standard', '25 images', 'marketplace listing', 'amazon etsy ebay'],
    packageKey: 'MarketplaceListing25',
    imageAllowance: 25,
    revisionAllowance: 2,
    defaultTurnaroundDays: 3,
    deliveryMode: 'FIVERR_ATTACHMENT',
    createsUploadLink: true,
    deliveryTemplateKey: 'fiverr_delivery_marketplace_25',
    active: true,
    safeDescription: FIVERR_SAFE_DELIVERY_LANGUAGE,
  },
  {
    key: 'fiverr_premium_50_marketplace',
    gigTitle: 'Premium marketplace product image pack — 50 images',
    searchHints: ['premium', '50 images', 'marketplace listing', 'shopify amazon etsy'],
    packageKey: 'MarketplaceListing50',
    imageAllowance: 50,
    revisionAllowance: 2,
    defaultTurnaroundDays: 5,
    deliveryMode: 'FIVERR_ATTACHMENT',
    createsUploadLink: true,
    deliveryTemplateKey: 'fiverr_delivery_marketplace_50',
    active: true,
    safeDescription: FIVERR_SAFE_DELIVERY_LANGUAGE,
  },
  {
    key: 'fiverr_product_launch_50',
    gigTitle: 'Product launch image pack — 50 images',
    searchHints: ['product launch', 'hero images', 'social commerce', '50 images'],
    packageKey: 'ProductLaunch50',
    imageAllowance: 50,
    revisionAllowance: 3,
    defaultTurnaroundDays: 7,
    deliveryMode: 'FIVERR_ATTACHMENT',
    createsUploadLink: true,
    deliveryTemplateKey: 'fiverr_delivery_product_launch_50',
    active: true,
    safeDescription: FIVERR_SAFE_DELIVERY_LANGUAGE,
  },
  {
    key: 'fiverr_monthly_seller_retainer',
    gigTitle: 'Monthly seller image cleanup retainer',
    searchHints: ['monthly', 'retainer', 'seller images', 'priority turnaround'],
    packageKey: 'MonthlySellerRetainer',
    imageAllowance: 100,
    revisionAllowance: 4,
    defaultTurnaroundDays: 30,
    deliveryMode: 'FIVERR_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    deliveryTemplateKey: 'fiverr_delivery_monthly_retainer',
    active: true,
    safeDescription: FIVERR_SAFE_DELIVERY_LANGUAGE,
  },
  {
    key: 'fiverr_agency_white_label',
    gigTitle: 'Agency white-label image fulfillment setup',
    searchHints: ['agency', 'white label', 'bulk image cleanup', 'client portal'],
    packageKey: 'AgencyWhiteLabel',
    imageAllowance: 500,
    revisionAllowance: 6,
    defaultTurnaroundDays: 30,
    deliveryMode: 'FIVERR_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    deliveryTemplateKey: 'fiverr_delivery_agency_white_label',
    active: true,
    safeDescription: FIVERR_SAFE_DELIVERY_LANGUAGE,
  },
];

export function normalizeFiverrOrderId(value: string) {
  return value.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
}

export function buildFiverrDedupeKey(orderId: string) {
  return `fiverr:${normalizeFiverrOrderId(orderId)}`;
}

export function redactFiverrBuyer(value: string | undefined) {
  if (!value) return undefined;
  const clean = value.trim();
  if (clean.length <= 2) return '**';
  return `${clean.slice(0, 1)}***${clean.slice(-1)}`;
}

export function findFiverrGigMapping(input: { gigTitle?: string; packagePurchased?: string; tierKey?: string }) {
  const haystack = `${input.tierKey ?? ''} ${input.gigTitle ?? ''} ${input.packagePurchased ?? ''}`.toLowerCase();
  return DEFAULT_FIVERR_GIG_MAPPINGS.find((mapping) =>
    mapping.key === input.tierKey || mapping.searchHints.some((hint) => haystack.includes(hint.toLowerCase())),
  ) ?? DEFAULT_FIVERR_GIG_MAPPINGS[1];
}

export function buildFiverrDeliveryTemplate(input: { buyerUsername?: string; jobNumber?: string; archiveFileName?: string; deliveryMode?: FiverrDeliveryMode }) {
  const buyer = input.buyerUsername ? `Hi ${input.buyerUsername},` : 'Hi,';
  const archive = input.archiveFileName ?? 'your ListingLift delivery ZIP';
  return [
    buyer,
    '',
    `Your product image pack${input.jobNumber ? ` for ${input.jobNumber}` : ''} is ready. I have attached or linked ${archive} according to Fiverr delivery requirements.`,
    '',
    FIVERR_SAFE_DELIVERY_LANGUAGE,
    '',
    'Please review the files and send any revision notes through Fiverr so the full order history remains in one place.',
  ].join('\n');
}

export function assertNoUnsafeFiverrAutomation(actions: string[]) {
  const blocked = actions.filter((action) => /scrape|password|auto[- ]?message|private page|credential/i.test(action));
  return { allowed: blocked.length === 0, blockedActions: blocked, rules: [...FIVERR_MARKETPLACE_SAFETY_RULES] };
}
