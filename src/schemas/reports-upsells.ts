import { z } from 'zod';

export const reportMetricKindSchema = z.enum([
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
]);

export const reportAudienceSchema = z.enum(['ADMIN', 'CLIENT', 'AGENCY', 'WHITE_LABEL']);
export const reportTypeSchema = z.enum([
  'DELIVERY_SUMMARY',
  'IMAGE_QUALITY',
  'LISTING_RECOMMENDATIONS',
  'MONTHLY_CLEANUP',
  'WHITE_LABEL',
  'REVENUE_ATTRIBUTION',
  'CLIENT_PROGRESS',
  'AGENCY_ROLLUP',
]);

export const reportMetricInputSchema = z.object({
  kind: reportMetricKindSchema,
  label: z.string().min(1).max(120),
  numericValue: z.number().optional(),
  textValue: z.string().max(500).optional(),
  trend: z.enum(['UP', 'DOWN', 'FLAT', 'UNKNOWN']).default('UNKNOWN'),
});

export const reportBuildInputSchema = z.object({
  organizationId: z.string().min(1),
  clientId: z.string().optional(),
  jobId: z.string().optional(),
  reportType: reportTypeSchema,
  audience: reportAudienceSchema,
  metrics: z.array(reportMetricInputSchema).default([]),
  qualityNotes: z.array(z.string().max(500)).default([]),
  deliveryNotes: z.array(z.string().max(500)).default([]),
  recommendationNotes: z.array(z.string().max(500)).default([]),
});

export const upsellOpportunityTypeSchema = z.enum([
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
]);

export const upsellChannelSchema = z.enum([
  'CLIENT_DASHBOARD',
  'EMAIL_DRAFT',
  'MANUAL_PLATFORM_MESSAGE',
  'INTERNAL_TASK',
]);

export const upsellSignalInputSchema = z.object({
  organizationId: z.string().min(1),
  clientId: z.string().optional(),
  jobId: z.string().optional(),
  packageKey: z.string().optional(),
  deliveredImageCount: z.number().int().nonnegative().default(0),
  flaggedOutputCount: z.number().int().nonnegative().default(0),
  revisionCount: z.number().int().nonnegative().default(0),
  hasSubscription: z.boolean().default(false),
  salesChannel: z.string().optional(),
  buyerType: z.string().optional(),
  daysSinceLastDelivery: z.number().int().nonnegative().default(0),
});

export const upsellGenerateInputSchema = z.object({
  signal: upsellSignalInputSchema,
  channel: upsellChannelSchema.default('CLIENT_DASHBOARD'),
  requestedTypes: z.array(upsellOpportunityTypeSchema).optional(),
});

export const upsellStatusUpdateSchema = z.object({
  upsellOfferId: z.string().min(1),
  status: z.enum(['DRAFT', 'READY', 'SENT', 'ACCEPTED', 'DECLINED', 'ARCHIVED']),
  note: z.string().max(500).optional(),
});

export const reportApprovalInputSchema = z.object({
  reportId: z.string().min(1),
  decision: z.enum(['APPROVE', 'REJECT', 'ARCHIVE']),
  note: z.string().max(500).optional(),
});
