export const DELIVERY_NOTIFICATION_TYPES = [
  'UPLOAD_RECEIVED',
  'PROCESSING_STARTED',
  'MANUAL_REVIEW_NEEDED',
  'JOB_COMPLETE',
  'REVISION_REQUESTED',
  'DOWNLOAD_READY',
  'CREDITS_LOW',
  'SUBSCRIPTION_RENEWAL',
  'FAILED_JOB_ALERT',
  'UPSELL_OPPORTUNITY_ALERT',
  'NEW_MARKETPLACE_ORDER_IMPORTED',
  'GUMROAD_PURCHASE_RECEIVED',
  'STRIPE_CHECKOUT_COMPLETED',
  'FIVERR_ORDER_MANUALLY_ADDED',
  'UPWORK_PROJECT_MANUALLY_ADDED',
  'TASKRABBIT_TASK_MANUALLY_ADDED',
  'DEADLINE_APPROACHING',
] as const;
export type DeliveryNotificationType = (typeof DELIVERY_NOTIFICATION_TYPES)[number];

export const DELIVERY_EMAIL_STATUSES = ['PLANNED', 'QUEUED', 'SENT', 'FAILED', 'SKIPPED'] as const;
export type DeliveryEmailStatus = (typeof DELIVERY_EMAIL_STATUSES)[number];

export const DELIVERY_DOWNLOAD_EVENT_TYPES = ['TOKEN_RESOLVED', 'DOWNLOAD_STARTED', 'DOWNLOAD_COMPLETED', 'DOWNLOAD_DENIED', 'TOKEN_REVOKED'] as const;
export type DeliveryDownloadEventType = (typeof DELIVERY_DOWNLOAD_EVENT_TYPES)[number];

export const MARKETPLACE_DELIVERY_TEMPLATE_KEYS = [
  'DIRECT_WEBSITE',
  'FIVERR',
  'UPWORK',
  'TASKRABBIT',
  'GUMROAD',
  'ETSY',
  'SHOPIFY',
  'TIKTOK_SHOP',
  'AMAZON_EXPORT',
  'EBAY_EXPORT',
  'FACEBOOK_MARKETPLACE',
  'INSTAGRAM',
  'MANUAL_EXTERNAL',
] as const;
export type MarketplaceDeliveryTemplateKey = (typeof MARKETPLACE_DELIVERY_TEMPLATE_KEYS)[number];

export type DeliveryAccessInput = {
  jobId: string;
  jobStatus?: string | null;
  deliveryLinkStatus?: string | null;
  deliveryArchiveStatus?: string | null;
  tokenExpiresAt: Date;
  tokenRevokedAt?: Date | null;
  approvedAt?: Date | null;
  deliveryArchiveApprovedAt?: Date | null;
  downloadCount?: number | null;
  maxDownloads?: number | null;
  now?: Date;
};

export type DeliveryAccessDecision = {
  jobId: string;
  allowed: boolean;
  publicStatus: 'AVAILABLE' | 'EXPIRED' | 'REVOKED' | 'NOT_READY' | 'LIMIT_REACHED';
  blockers: string[];
  warnings: string[];
  safeLanguage: string;
};

export function normalizeDeliveryStatus(value?: string | null) {
  return (value ?? '').trim().toUpperCase();
}

export function isDeliveryReadyJobStatus(status?: string | null) {
  return ['READY_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(normalizeDeliveryStatus(status));
}

export function evaluateDeliveryAccess(input: DeliveryAccessInput): DeliveryAccessDecision {
  const now = input.now ?? new Date();
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (normalizeDeliveryStatus(input.deliveryLinkStatus) !== 'ACTIVE') blockers.push('Delivery link is not active.');
  if (input.tokenRevokedAt) blockers.push('Delivery link has been revoked.');
  if (input.tokenExpiresAt.getTime() <= now.getTime()) blockers.push('Delivery link has expired.');
  if (!isDeliveryReadyJobStatus(input.jobStatus)) blockers.push('Job is not ready for delivery.');
  if (!input.approvedAt) blockers.push('Job has not received manual admin approval.');
  if (normalizeDeliveryStatus(input.deliveryArchiveStatus) !== 'APPROVED') blockers.push('Delivery archive is not approved.');
  if (!input.deliveryArchiveApprovedAt) blockers.push('Delivery archive approval timestamp is missing.');
  if (input.maxDownloads && (input.downloadCount ?? 0) >= input.maxDownloads) blockers.push('Delivery link download limit has been reached.');

  if (input.maxDownloads && input.maxDownloads - (input.downloadCount ?? 0) <= 1) warnings.push('This delivery link is close to its download limit.');

  const publicStatus: DeliveryAccessDecision['publicStatus'] = input.tokenRevokedAt
    ? 'REVOKED'
    : input.tokenExpiresAt.getTime() <= now.getTime()
      ? 'EXPIRED'
      : input.maxDownloads && (input.downloadCount ?? 0) >= input.maxDownloads
        ? 'LIMIT_REACHED'
        : blockers.length
          ? 'NOT_READY'
          : 'AVAILABLE';

  return {
    jobId: input.jobId,
    allowed: blockers.length === 0,
    publicStatus,
    blockers,
    warnings,
    safeLanguage: 'Files are provided as platform-ready drafts. Seller review against current marketplace guidelines is recommended before publishing.',
  };
}

export function redactEmailAddress(email: string) {
  return email.replace(/(^.).*(@.*$)/, '$1***$2');
}

export function buildMarketplaceDeliveryMessage(input: {
  templateKey: MarketplaceDeliveryTemplateKey;
  buyerName?: string | null;
  packageName?: string | null;
  downloadUrl: string;
  expiresAt: Date;
  revisionInstructions?: string | null;
}) {
  const buyer = input.buyerName?.trim() || 'there';
  const packageName = input.packageName?.trim() || 'your ListingLift image pack';
  const expiration = input.expiresAt.toISOString().slice(0, 10);
  const revision = input.revisionInstructions?.trim() || 'Reply with any revision notes through the approved order/project channel.';
  const platformNote = input.templateKey === 'FIVERR' || input.templateKey === 'UPWORK' || input.templateKey === 'TASKRABBIT'
    ? 'I can also deliver inside this platform if required by the order workflow.'
    : 'Please review the images before publishing them to any marketplace or storefront.';

  return [
    `Hi ${buyer},`,
    '',
    `${packageName} is ready for review and download: ${input.downloadUrl}`,
    '',
    `This secure link expires on ${expiration}. The files are organized as platform-ready drafts with seller review recommended before publishing.`,
    platformNote,
    revision,
    '',
    'Thanks for using ListingLift.',
  ].join('\n');
}

export function buildDeliveryNotificationSubject(type: DeliveryNotificationType, jobNumber?: string | null) {
  const prefix = jobNumber ? `ListingLift ${jobNumber}` : 'ListingLift';
  const subjectByType: Record<DeliveryNotificationType, string> = {
    UPLOAD_RECEIVED: 'Upload received',
    PROCESSING_STARTED: 'Processing started',
    MANUAL_REVIEW_NEEDED: 'Manual review needed',
    JOB_COMPLETE: 'Job complete',
    REVISION_REQUESTED: 'Revision requested',
    DOWNLOAD_READY: 'Download ready',
    CREDITS_LOW: 'Credits running low',
    SUBSCRIPTION_RENEWAL: 'Subscription renewal reminder',
    FAILED_JOB_ALERT: 'Job needs attention',
    UPSELL_OPPORTUNITY_ALERT: 'Recommended next image refresh',
    NEW_MARKETPLACE_ORDER_IMPORTED: 'New marketplace order imported',
    GUMROAD_PURCHASE_RECEIVED: 'Gumroad purchase received',
    STRIPE_CHECKOUT_COMPLETED: 'Stripe checkout completed',
    FIVERR_ORDER_MANUALLY_ADDED: 'Fiverr order added',
    UPWORK_PROJECT_MANUALLY_ADDED: 'Upwork project added',
    TASKRABBIT_TASK_MANUALLY_ADDED: 'Taskrabbit task added',
    DEADLINE_APPROACHING: 'Deadline approaching',
  };
  return `${prefix}: ${subjectByType[type]}`;
}
