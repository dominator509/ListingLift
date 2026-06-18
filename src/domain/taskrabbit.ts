import { type RequiredPackageKey } from './database-keys';

export type TaskrabbitServiceAngleKey =
  | 'local_product_photo_cleanup'
  | 'marketplace_listing_photo_prep'
  | 'restaurant_menu_image_cleanup'
  | 'real_estate_listing_visuals'
  | 'small_business_ecommerce_setup'
  | 'facebook_marketplace_ebay_listing_help'
  | 'direct_retainer_conversion';

export type TaskrabbitTaskCategory =
  | 'PRODUCT_PHOTO_CLEANUP'
  | 'MARKETPLACE_LISTING_HELP'
  | 'RESTAURANT_MENU_CLEANUP'
  | 'REAL_ESTATE_LISTING_VISUALS'
  | 'SMALL_BUSINESS_ECOMMERCE_SETUP'
  | 'LOCAL_SELLER_SUPPORT'
  | 'OTHER_LOCAL_SERVICE';

export type TaskrabbitWorkflowStatus =
  | 'DRAFT'
  | 'TASK_CAPTURED'
  | 'CUSTOMER_CONTACTED'
  | 'FILES_NEEDED'
  | 'FILES_RECEIVED'
  | 'PROCESSING'
  | 'WAITING_FOR_REVIEW'
  | 'DELIVERY_READY'
  | 'DELIVERED_IN_TASKRABBIT'
  | 'REVISION_REQUESTED'
  | 'DIRECT_FOLLOW_UP_PLANNED'
  | 'DIRECT_RETAINER_CONVERTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export type TaskrabbitDeliveryMode = 'TASKRABBIT_MESSAGE' | 'TASKRABBIT_MESSAGE_WITH_ALLOWED_LINK' | 'MANUAL_EXTERNAL_DELIVERY_RECORDED';
export type TaskrabbitConversionStatus = 'NOT_TRACKED' | 'FOLLOW_UP_NEEDED' | 'FOLLOW_UP_SENT' | 'INTERESTED' | 'CONVERTED_TO_DIRECT_CLIENT' | 'DECLINED' | 'DO_NOT_CONTACT';
export type TaskrabbitAppointmentStatus = 'NOT_SCHEDULED' | 'REQUESTED' | 'SCHEDULED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export type TaskrabbitServiceMapping = {
  key: TaskrabbitServiceAngleKey;
  category: TaskrabbitTaskCategory;
  title: string;
  searchHints: string[];
  packageKey: RequiredPackageKey;
  imageAllowance: number;
  revisionAllowance: number;
  defaultTurnaroundDays: number;
  defaultDeliveryMode: TaskrabbitDeliveryMode;
  createsUploadLink: boolean;
  conversionFollowUpRecommended: boolean;
  active: boolean;
  safeDescription: string;
};

export const TASKRABBIT_PROVIDER_KEY = 'taskrabbit' as const;

export const TASKRABBIT_MARKETPLACE_SAFETY_RULES = [
  'Taskrabbit baseline workflow is manual-first because local task intake and messaging rules may vary by task context.',
  'Do not scrape private Taskrabbit pages, private task details, customer profiles, addresses, messages, or calendars.',
  'Do not store Taskrabbit passwords, unnecessary customer location data, or private message content.',
  'Do not automate Taskrabbit messaging, booking, cancellation, delivery, or follow-up unless an approved integration permits it.',
  'Keep customer communication and delivery inside Taskrabbit when the task context or platform rules require it.',
  'Use external upload or download links only when allowed by the task context and customer consent.',
  'Do not store full addresses unless local appointment fulfillment absolutely requires it; use coarse location/area notes where possible.',
  'Track direct-client conversion only as an internal follow-up opportunity and never move platform customers off-platform in violation of platform rules.',
  'Never guarantee marketplace approval, ranking, sales, conversion, ad performance, product approval, or listing approval.',
] as const;

export const TASKRABBIT_SAFE_SERVICE_LANGUAGE =
  'ListingLift prepares platform-ready draft product, menu, listing, and local-business image files for customer review. Review all files against current marketplace, brand, restaurant, real-estate, or local listing guidelines before publishing. Marketplace approval, ranking, sales, conversion, ad performance, product approval, or listing approval are not guaranteed.';

export const DEFAULT_TASKRABBIT_SERVICE_MAPPINGS: TaskrabbitServiceMapping[] = [
  {
    key: 'local_product_photo_cleanup',
    category: 'PRODUCT_PHOTO_CLEANUP',
    title: 'Local product photo cleanup support',
    searchHints: ['product photo', 'cleanup', 'background removal', 'local seller'],
    packageKey: 'QuickCleanup10',
    imageAllowance: 10,
    revisionAllowance: 1,
    defaultTurnaroundDays: 2,
    defaultDeliveryMode: 'TASKRABBIT_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    conversionFollowUpRecommended: true,
    active: true,
    safeDescription: TASKRABBIT_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'marketplace_listing_photo_prep',
    category: 'MARKETPLACE_LISTING_HELP',
    title: 'Marketplace listing photo preparation',
    searchHints: ['marketplace', 'facebook marketplace', 'ebay', 'etsy', 'listing photos'],
    packageKey: 'MarketplaceListing50',
    imageAllowance: 50,
    revisionAllowance: 2,
    defaultTurnaroundDays: 5,
    defaultDeliveryMode: 'TASKRABBIT_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    conversionFollowUpRecommended: true,
    active: true,
    safeDescription: TASKRABBIT_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'restaurant_menu_image_cleanup',
    category: 'RESTAURANT_MENU_CLEANUP',
    title: 'Restaurant menu image cleanup',
    searchHints: ['restaurant', 'menu', 'food photos', 'local listing', 'google business'],
    packageKey: 'ProductLaunch50',
    imageAllowance: 50,
    revisionAllowance: 2,
    defaultTurnaroundDays: 4,
    defaultDeliveryMode: 'TASKRABBIT_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    conversionFollowUpRecommended: true,
    active: true,
    safeDescription: TASKRABBIT_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'real_estate_listing_visuals',
    category: 'REAL_ESTATE_LISTING_VISUALS',
    title: 'Real estate listing visual organization',
    searchHints: ['real estate', 'listing visuals', 'property photos', 'folder organization'],
    packageKey: 'MarketplaceListing50',
    imageAllowance: 50,
    revisionAllowance: 1,
    defaultTurnaroundDays: 3,
    defaultDeliveryMode: 'TASKRABBIT_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    conversionFollowUpRecommended: false,
    active: true,
    safeDescription: TASKRABBIT_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'small_business_ecommerce_setup',
    category: 'SMALL_BUSINESS_ECOMMERCE_SETUP',
    title: 'Small business ecommerce image setup support',
    searchHints: ['small business', 'ecommerce setup', 'shopify', 'product gallery'],
    packageKey: 'ProductLaunch50',
    imageAllowance: 75,
    revisionAllowance: 3,
    defaultTurnaroundDays: 7,
    defaultDeliveryMode: 'TASKRABBIT_MESSAGE_WITH_ALLOWED_LINK',
    createsUploadLink: true,
    conversionFollowUpRecommended: true,
    active: true,
    safeDescription: TASKRABBIT_SAFE_SERVICE_LANGUAGE,
  },
  {
    key: 'direct_retainer_conversion',
    category: 'LOCAL_SELLER_SUPPORT',
    title: 'Direct monthly image refresh follow-up',
    searchHints: ['monthly', 'ongoing', 'retainer', 'direct client', 'refresh'],
    packageKey: 'MonthlySellerRetainer',
    imageAllowance: 150,
    revisionAllowance: 4,
    defaultTurnaroundDays: 30,
    defaultDeliveryMode: 'MANUAL_EXTERNAL_DELIVERY_RECORDED',
    createsUploadLink: true,
    conversionFollowUpRecommended: true,
    active: true,
    safeDescription: TASKRABBIT_SAFE_SERVICE_LANGUAGE,
  },
];

export function normalizeTaskrabbitTaskId(value: string) {
  return value.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
}

export function buildTaskrabbitDedupeKey(taskId: string) {
  return `taskrabbit:${normalizeTaskrabbitTaskId(taskId)}`;
}

export function redactTaskrabbitCustomer(value: string | undefined) {
  if (!value) return undefined;
  const clean = value.trim();
  if (clean.length <= 2) return '**';
  return `${clean.slice(0, 1)}***${clean.slice(-1)}`;
}

export function findTaskrabbitServiceMapping(input: { category?: string; serviceAngleKey?: string; taskTitle?: string; taskNotes?: string; packagePurchased?: string }) {
  const haystack = `${input.serviceAngleKey ?? ''} ${input.category ?? ''} ${input.taskTitle ?? ''} ${input.taskNotes ?? ''} ${input.packagePurchased ?? ''}`.toLowerCase();
  return DEFAULT_TASKRABBIT_SERVICE_MAPPINGS.find((mapping) =>
    mapping.key === input.serviceAngleKey ||
    mapping.category === input.category ||
    mapping.searchHints.some((hint) => haystack.includes(hint.toLowerCase())),
  ) ?? DEFAULT_TASKRABBIT_SERVICE_MAPPINGS[0];
}

export function buildTaskrabbitDeliveryMessage(input: { customerName?: string; taskId?: string; archiveFileName?: string; includeExternalLink?: boolean; externalLinkAllowed?: boolean }) {
  const customer = input.customerName ? `Hi ${input.customerName},` : 'Hi,';
  const archive = input.archiveFileName ?? 'the ListingLift delivery ZIP';
  const linkLine = input.includeExternalLink && input.externalLinkAllowed
    ? 'I included the allowed delivery link below/with this message. Please download it before the link expires.'
    : 'I am delivering the files through the approved Taskrabbit task/message flow for this task.';
  return [
    customer,
    '',
    `The image pack${input.taskId ? ` for task ${normalizeTaskrabbitTaskId(input.taskId)}` : ''} is ready. ${archive} contains organized draft files for your review.`,
    linkLine,
    '',
    TASKRABBIT_SAFE_SERVICE_LANGUAGE,
    '',
    'Please send any revision notes through the agreed task communication channel so the task history stays clear.',
  ].join('\n');
}

export function buildTaskrabbitDirectFollowUpPrompt(input: { customerName?: string; businessName?: string; monthlyImageEstimate?: number; serviceAngle?: string }) {
  const customer = input.customerName ? `${input.customerName}, ` : '';
  const business = input.businessName ? `for ${input.businessName}` : 'for your business';
  const estimate = input.monthlyImageEstimate ? `${input.monthlyImageEstimate}+ images/month` : 'recurring image updates';
  const angle = input.serviceAngle ? ` after this ${input.serviceAngle} task` : '';
  return `${customer}if you expect ${estimate} ${business}${angle}, ListingLift can support a monthly image refresh workflow with priority turnaround, organized folders, revision allowance, image archive, and monthly refresh recommendations. Only use this follow-up where platform rules and customer consent allow it.`;
}

export function isUnsafeTaskrabbitAutomationAction(action: string) {
  const unsafe = ['scrape', 'password', 'auto-message', 'automated message', 'book task', 'cancel task', 'address scrape', 'profile scrape', 'private messages'];
  const lower = action.toLowerCase();
  return unsafe.some((term) => lower.includes(term));
}
