import { type RequiredPackageKey } from './database-keys';

export type UpworkOfferKey =
  | 'upwork_fixed_quick_cleanup'
  | 'upwork_bulk_marketplace_pack'
  | 'upwork_product_launch_pack'
  | 'upwork_hourly_catalog_support'
  | 'upwork_monthly_retainer'
  | 'upwork_agency_subcontract';

export type UpworkContractType = 'FIXED_PRICE' | 'HOURLY' | 'RETAINER' | 'AGENCY_SUBCONTRACT' | 'BULK_CATALOG';
export type UpworkMilestoneStatus = 'NONE' | 'PROPOSED' | 'ACTIVE' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'PAUSED' | 'CLOSED' | 'DISPUTED';
export type UpworkWorkflowStatus =
  | 'DRAFT'
  | 'CONTRACT_CAPTURED'
  | 'FILES_NEEDED'
  | 'FILES_RECEIVED'
  | 'PROCESSING'
  | 'WAITING_FOR_REVIEW'
  | 'FLAGGED'
  | 'APPROVED'
  | 'DELIVERY_READY'
  | 'DELIVERED_IN_UPWORK'
  | 'REVISION_REQUESTED'
  | 'REPROCESSING'
  | 'RETAINER_REMINDER_SENT'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';
export type UpworkDeliveryMode = 'UPWORK_ATTACHMENT' | 'UPWORK_MESSAGE_WITH_ALLOWED_LINK' | 'MANUAL_EXTERNAL_DELIVERY_RECORDED';
export type UpworkRevisionStatus = 'NONE' | 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'DELIVERED' | 'CLOSED';

export type UpworkOfferMapping = {
  key: UpworkOfferKey;
  contractType: UpworkContractType;
  title: string;
  searchHints: string[];
  packageKey: RequiredPackageKey;
  imageAllowance: number;
  revisionAllowance: number;
  defaultTurnaroundDays: number;
  defaultMilestoneStatus: UpworkMilestoneStatus;
  deliveryMode: UpworkDeliveryMode;
  createsUploadLink: boolean;
  proposalTemplateKey: string;
  deliveryTemplateKey: string;
  retainerReminderEnabled: boolean;
  active: boolean;
  safeDescription: string;
};

export const UPWORK_PROVIDER_KEY = 'upwork' as const;

export const UPWORK_MARKETPLACE_SAFETY_RULES = [
  'Direct Upwork API access may be limited or require approval; baseline workflow is manual-first.',
  'Do not scrape private Upwork pages, contracts, messages, work diaries, or client profiles.',
  'Do not store Upwork passwords, client private messages, or unnecessary personal data.',
  'Do not automate Upwork messaging, proposal submission, or delivery unless an approved integration permits it.',
  'Keep client communication and delivery inside Upwork when Upwork rules or the contract context require it.',
  'Use external links only when allowed by the contract, client context, and Upwork rules.',
  'Keep contract source attribution for revenue tracking and support.',
  'Never guarantee marketplace approval, ranking, sales, conversion, ad performance, or product/listing approval.',
] as const;

export const UPWORK_SAFE_SERVICE_LANGUAGE =
  'ListingLift prepares platform-ready draft product image files for seller review. Review all files against current marketplace and brand guidelines before publishing. Marketplace approval, ranking, sales, conversion, ad performance, product approval, or listing approval are not guaranteed.';

export const DEFAULT_UPWORK_OFFER_MAPPINGS: UpworkOfferMapping[] = [
  {
    key: 'upwork_fixed_quick_cleanup',
    contractType: 'FIXED_PRICE',
    title: 'Fixed-price product photo cleanup — 10 images',
    searchHints: ['fixed', 'quick cleanup', '10 images', 'background removal'],
    packageKey: 'QuickCleanup10',
    imageAllowance: 10,
    revisionAllowance: 1,
    defaultTurnaroundDays: 2,
    defaultMilestoneStatus: 'ACTIVE',
    deliveryMode: 'UPWORK_ATTACHMENT',
    createsUploadLink: true,
    proposalTemplateKey: 'upwork_proposal_quick_cleanup',
    deliveryTemplateKey: 'upwork_delivery_quick_cleanup',
    retainerReminderEnabled: false,
    active: true,
    safeDescription: UPWORK_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'upwork_bulk_marketplace_pack',
    contractType: 'FIXED_PRICE',
    title: 'Bulk marketplace product image pack',
    searchHints: ['bulk', 'marketplace', 'shopify', 'etsy', 'amazon', 'product images'],
    packageKey: 'MarketplaceListing50',
    imageAllowance: 50,
    revisionAllowance: 2,
    defaultTurnaroundDays: 5,
    defaultMilestoneStatus: 'ACTIVE',
    deliveryMode: 'UPWORK_ATTACHMENT',
    createsUploadLink: true,
    proposalTemplateKey: 'upwork_proposal_bulk_marketplace',
    deliveryTemplateKey: 'upwork_delivery_bulk_marketplace',
    retainerReminderEnabled: true,
    active: true,
    safeDescription: UPWORK_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'upwork_product_launch_pack',
    contractType: 'FIXED_PRICE',
    title: 'Product launch image pack for ecommerce founders',
    searchHints: ['launch', 'hero images', 'social commerce', 'ad-ready', 'product launch'],
    packageKey: 'ProductLaunch50',
    imageAllowance: 50,
    revisionAllowance: 3,
    defaultTurnaroundDays: 7,
    defaultMilestoneStatus: 'ACTIVE',
    deliveryMode: 'UPWORK_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    proposalTemplateKey: 'upwork_proposal_product_launch',
    deliveryTemplateKey: 'upwork_delivery_product_launch',
    retainerReminderEnabled: true,
    active: true,
    safeDescription: UPWORK_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'upwork_hourly_catalog_support',
    contractType: 'HOURLY',
    title: 'Hourly ecommerce catalog image cleanup support',
    searchHints: ['hourly', 'catalog', 'ongoing', 'support', 'batch cleanup'],
    packageKey: 'MonthlySellerRetainer',
    imageAllowance: 100,
    revisionAllowance: 4,
    defaultTurnaroundDays: 30,
    defaultMilestoneStatus: 'NONE',
    deliveryMode: 'UPWORK_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    proposalTemplateKey: 'upwork_proposal_hourly_catalog',
    deliveryTemplateKey: 'upwork_delivery_hourly_catalog',
    retainerReminderEnabled: true,
    active: true,
    safeDescription: UPWORK_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'upwork_monthly_retainer',
    contractType: 'RETAINER',
    title: 'Monthly seller image cleanup retainer',
    searchHints: ['retainer', 'monthly', 'seller', 'recurring', 'priority'],
    packageKey: 'MonthlySellerRetainer',
    imageAllowance: 150,
    revisionAllowance: 4,
    defaultTurnaroundDays: 30,
    defaultMilestoneStatus: 'ACTIVE',
    deliveryMode: 'UPWORK_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    proposalTemplateKey: 'upwork_proposal_monthly_retainer',
    deliveryTemplateKey: 'upwork_delivery_monthly_retainer',
    retainerReminderEnabled: true,
    active: true,
    safeDescription: UPWORK_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'upwork_agency_subcontract',
    contractType: 'AGENCY_SUBCONTRACT',
    title: 'White-label agency product image fulfillment',
    searchHints: ['agency', 'white-label', 'subcontract', 'bulk', 'client portal'],
    packageKey: 'AgencyWhiteLabel',
    imageAllowance: 500,
    revisionAllowance: 6,
    defaultTurnaroundDays: 30,
    defaultMilestoneStatus: 'ACTIVE',
    deliveryMode: 'UPWORK_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    proposalTemplateKey: 'upwork_proposal_agency_subcontract',
    deliveryTemplateKey: 'upwork_delivery_agency_subcontract',
    retainerReminderEnabled: true,
    active: true,
    safeDescription: UPWORK_SAFE_SERVICE_LANGUAGE,
  },
];

export function normalizeUpworkContractId(value: string) {
  return value.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
}

export function buildUpworkDedupeKey(contractId: string) {
  return `upwork:${normalizeUpworkContractId(contractId)}`;
}

export function redactUpworkClient(value: string | undefined) {
  if (!value) return undefined;
  const clean = value.trim();
  if (clean.length <= 2) return '**';
  return `${clean.slice(0, 1)}***${clean.slice(-1)}`;
}

export function findUpworkOfferMapping(input: { contractTitle?: string; contractType?: string; offerKey?: string; packagePurchased?: string }) {
  const haystack = `${input.offerKey ?? ''} ${input.contractType ?? ''} ${input.contractTitle ?? ''} ${input.packagePurchased ?? ''}`.toLowerCase();
  return DEFAULT_UPWORK_OFFER_MAPPINGS.find((mapping) =>
    mapping.key === input.offerKey || mapping.contractType === input.contractType || mapping.searchHints.some((hint) => haystack.includes(hint.toLowerCase())),
  ) ?? DEFAULT_UPWORK_OFFER_MAPPINGS[1];
}

export function buildUpworkProposalTemplate(input: { clientName?: string; contractTitle?: string; packageLabel?: string; turnaroundDays?: number; imageAllowance?: number }) {
  const client = input.clientName ? `Hi ${input.clientName},` : 'Hi,';
  const packageLabel = input.packageLabel ?? 'marketplace-ready product image pack';
  const images = input.imageAllowance ? `${input.imageAllowance} product images` : 'your product images';
  const turnaround = input.turnaroundDays ? `${input.turnaroundDays} business days` : 'the agreed turnaround window';
  return [
    client,
    '',
    `I can help prepare ${images} as a ${packageLabel}: background cleanup, seller-review-ready exports, organized folders, and ZIP delivery.`,
    `For this scope, I would complete the first delivery within ${turnaround} after receiving the source files and any SKU/platform notes.`,
    '',
    UPWORK_SAFE_SERVICE_LANGUAGE,
    '',
    'I can also support ongoing monthly image refreshes if you expect recurring product uploads.',
  ].join('\n');
}

export function buildUpworkDeliveryTemplate(input: { clientName?: string; contractId?: string; archiveFileName?: string; deliveryMode?: UpworkDeliveryMode; includeExternalLink?: boolean; externalLinkAllowed?: boolean }) {
  const client = input.clientName ? `Hi ${input.clientName},` : 'Hi,';
  const archive = input.archiveFileName ?? 'the ListingLift delivery ZIP';
  const linkLine = input.includeExternalLink && input.externalLinkAllowed
    ? 'I included the allowed delivery link below/with this message. Please download it before the link expires.'
    : 'I am delivering the files through the approved Upwork delivery/message flow for this contract.';
  return [
    client,
    '',
    `The image pack${input.contractId ? ` for contract ${normalizeUpworkContractId(input.contractId)}` : ''} is ready. ${archive} contains the organized platform-ready draft files, manifest, and ReadMe.`,
    linkLine,
    '',
    UPWORK_SAFE_SERVICE_LANGUAGE,
    '',
    'Please send any revision notes through Upwork so the full contract history remains in one place.',
  ].join('\n');
}

export function buildUpworkRetainerUpsellReminder(input: { clientName?: string; monthlyImageEstimate?: number; contractTitle?: string }) {
  const client = input.clientName ? `${input.clientName}, ` : '';
  const estimate = input.monthlyImageEstimate ? `${input.monthlyImageEstimate}+ images/month` : 'recurring product image updates';
  return `${client}if you expect ${estimate}, ListingLift can convert this into a monthly seller image retainer with priority turnaround, organized product folders, revision allowance, archive history, and monthly refresh recommendations.`;
}

export function assertNoUnsafeUpworkAutomation(actions: string[]) {
  const blocked = actions.filter((action) => /scrape|password|auto[- ]?message|auto[- ]?proposal|private page|work diary|credential|bypass/i.test(action));
  return { allowed: blocked.length === 0, blockedActions: blocked, rules: [...UPWORK_MARKETPLACE_SAFETY_RULES] };
}
