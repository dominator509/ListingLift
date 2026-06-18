export const REPORT_PHASE = 'phase-32-reports-upsell-engine' as const;

export const reportTypeKeys = [
  'DELIVERY_SUMMARY',
  'IMAGE_QUALITY',
  'LISTING_RECOMMENDATIONS',
  'MONTHLY_CLEANUP',
  'WHITE_LABEL',
  'REVENUE_ATTRIBUTION',
  'CLIENT_PROGRESS',
  'AGENCY_ROLLUP',
] as const;

export type ReportTypeKey = (typeof reportTypeKeys)[number];

export const reportAudiences = ['ADMIN', 'CLIENT', 'AGENCY', 'WHITE_LABEL'] as const;
export type ReportAudience = (typeof reportAudiences)[number];

export const reportMetricKinds = [
  'JOB_COUNT',
  'IMAGE_COUNT',
  'APPROVED_OUTPUT_COUNT',
  'FLAGGED_OUTPUT_COUNT',
  'REVISION_COUNT',
  'DELIVERY_COUNT',
  'DOWNLOAD_COUNT',
  'REVENUE_CENTS',
  'CREDIT_BALANCE',
  'SUBSCRIPTION_STATUS',
  'QUALITY_SCORE',
  'TURNAROUND_HOURS',
] as const;

export type ReportMetricKind = (typeof reportMetricKinds)[number];

export const upsellOpportunityTypes = [
  'MORE_IMAGE_PACKS',
  'MONTHLY_RETAINER',
  'LISTING_SEO',
  'PRODUCT_DESCRIPTION_REWRITE',
  'AD_CREATIVE_PACK',
  'GUMROAD_OFFER_IMAGE_PACK',
  'SHOPIFY_PRODUCT_PAGE_IMPROVEMENT',
  'TIKTOK_SHOP_CREATIVE_PACK',
  'DASHBOARD_ACCESS',
  'AGENCY_WHITE_LABEL_LICENSE',
] as const;

export type UpsellOpportunityType = (typeof upsellOpportunityTypes)[number];

export const upsellChannels = [
  'CLIENT_DASHBOARD',
  'EMAIL_DRAFT',
  'MANUAL_PLATFORM_MESSAGE',
  'INTERNAL_TASK',
] as const;

export type UpsellChannel = (typeof upsellChannels)[number];

export type ReportMetricInput = {
  kind: ReportMetricKind;
  label: string;
  numericValue?: number;
  textValue?: string;
  trend?: 'UP' | 'DOWN' | 'FLAT' | 'UNKNOWN';
};

export type ReportBuildInput = {
  organizationId: string;
  clientId?: string;
  jobId?: string;
  reportType: ReportTypeKey;
  audience: ReportAudience;
  metrics: ReportMetricInput[];
  qualityNotes?: string[];
  deliveryNotes?: string[];
  recommendationNotes?: string[];
};

export type UpsellSignalInput = {
  organizationId: string;
  clientId?: string;
  jobId?: string;
  packageKey?: string;
  deliveredImageCount?: number;
  flaggedOutputCount?: number;
  revisionCount?: number;
  hasSubscription?: boolean;
  salesChannel?: string;
  buyerType?: string;
  daysSinceLastDelivery?: number;
};

export const REPORT_SAFE_CLAIMS = [
  'Formatted as a platform-ready draft for seller review.',
  'Review current marketplace guidelines before publishing.',
  'This report does not guarantee approval, ranking, sales, conversion, or ad performance.',
];

export function assertReportSafeCopy(copy: string): string[] {
  const unsafePatterns = [
    /(?<!\b(?:not|no|never)\s+)guarantee(s|d)?\s+(approval|ranking|sales|conversion|performance)/i,
    /amazon\s+compliant/i,
    /etsy\s+approved/i,
    /will\s+rank/i,
    /increase\s+sales/i,
  ];
  return unsafePatterns.filter((pattern) => pattern.test(copy)).map((pattern) => pattern.source);
}

export function formatMoneyFromCents(cents?: number, currency = 'USD') {
  if (typeof cents !== 'number') return 'Manual quote';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export function scoreUpsellPriority(input: UpsellSignalInput) {
  let score = 25;
  if ((input.deliveredImageCount ?? 0) >= 25) score += 15;
  if ((input.flaggedOutputCount ?? 0) > 0) score += 8;
  if ((input.revisionCount ?? 0) > 1) score += 6;
  if (!input.hasSubscription) score += 18;
  if ((input.daysSinceLastDelivery ?? 0) >= 20) score += 10;
  if (input.buyerType?.toLowerCase().includes('agency')) score += 12;
  return Math.min(100, score);
}

export function recommendUpsellTypes(input: UpsellSignalInput): UpsellOpportunityType[] {
  const recommendations: UpsellOpportunityType[] = ['MORE_IMAGE_PACKS'];
  if (!input.hasSubscription) recommendations.push('MONTHLY_RETAINER');
  if ((input.deliveredImageCount ?? 0) >= 25) recommendations.push('AD_CREATIVE_PACK');
  if (input.salesChannel?.toLowerCase().includes('shopify')) recommendations.push('SHOPIFY_PRODUCT_PAGE_IMPROVEMENT');
  if (input.salesChannel?.toLowerCase().includes('tiktok')) recommendations.push('TIKTOK_SHOP_CREATIVE_PACK');
  if (input.buyerType?.toLowerCase().includes('agency')) recommendations.push('AGENCY_WHITE_LABEL_LICENSE');
  return Array.from(new Set(recommendations));
}
