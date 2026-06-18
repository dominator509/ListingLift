import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS } from '@/domain/database-keys';

export const etsyOrderSourceModeSchema = z.enum(['MANUAL', 'CSV_IMPORT', 'API_SCAFFOLD', 'WEBHOOK_SCAFFOLD']);
export const etsyWorkflowStatusSchema = z.enum(['DRAFT', 'ORDER_CAPTURED', 'LISTING_DATA_NEEDED', 'FILES_NEEDED', 'FILES_RECEIVED', 'PROCESSING', 'WAITING_FOR_QC', 'WAITING_FOR_APPROVAL', 'DELIVERY_READY', 'DELIVERED_IN_ETSY', 'REVISION_REQUESTED', 'SHOP_REFRESH_UPSELL_READY', 'COMPLETED', 'CANCELLED', 'FAILED']);
export const etsyListingImageUseCaseSchema = z.enum(['SQUARE_LISTING_IMAGE', 'WHITE_BACKGROUND_IMAGE', 'TRANSPARENT_CUTOUT', 'LIFESTYLE_STYLE_MOCKUP', 'SHOP_VISUAL_CONSISTENCY', 'LISTING_SEQUENCE_RECOMMENDATION']);
export const etsyDeliveryModeSchema = z.enum(['ETSY_MESSAGE', 'ETSY_MESSAGE_WITH_ALLOWED_LINK', 'EMAIL_WITH_ALLOWED_LINK', 'MANUAL_EXTERNAL_DELIVERY_RECORDED']);
export const etsyRevisionStatusSchema = z.enum(['NONE', 'REQUESTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'CLOSED']);

const amountToCents = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Math.round(value * 100);
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : undefined;
});

export const etsyManualOrderInputSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  orderId: z.string().trim().min(1),
  shopId: z.string().trim().optional(),
  shopName: z.string().trim().optional(),
  buyerName: z.string().trim().optional(),
  buyerUsername: z.string().trim().optional(),
  buyerEmail: z.string().trim().optional(),
  listingIds: z.array(z.string().trim().min(1)).default([]),
  listingTitles: z.array(z.string().trim().min(1)).default([]),
  productCategory: z.string().trim().optional(),
  packagePurchased: z.string().trim().optional(),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).optional(),
  etsyPackKey: z.string().trim().optional(),
  imageQuantity: z.number().int().positive().optional(),
  orderAmount: amountToCents,
  orderAmountCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  deadline: z.string().datetime().optional(),
  revisionAllowance: z.number().int().nonnegative().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().max(5000).optional(),
  useCases: z.array(etsyListingImageUseCaseSchema).default(['SQUARE_LISTING_IMAGE', 'WHITE_BACKGROUND_IMAGE', 'TRANSPARENT_CUTOUT']),
  deliveryMode: etsyDeliveryModeSchema.default('ETSY_MESSAGE_WITH_ALLOWED_LINK'),
  externalLinkAllowed: z.boolean().default(false),
  uploadStatus: z.enum(['NOT_STARTED', 'WAITING_FOR_UPLOAD', 'RECEIVED', 'PARTIAL', 'FAILED']).default('WAITING_FOR_UPLOAD'),
  sourceMode: etsyOrderSourceModeSchema.default('MANUAL'),
  dryRun: z.boolean().default(true),
});

export const etsyListingImportInputSchema = z.object({
  organizationId: z.string().optional(),
  shopId: z.string().trim().optional(),
  shopName: z.string().trim().optional(),
  listingRows: z.array(z.object({
    listingId: z.string().trim().min(1),
    title: z.string().trim().min(1),
    sku: z.string().trim().optional(),
    category: z.string().trim().optional(),
    imageCount: z.number().int().nonnegative().optional(),
    sourceUrl: z.string().url().optional().or(z.literal('')),
  })).default([]),
  importMode: etsyOrderSourceModeSchema.default('CSV_IMPORT'),
  dryRun: z.boolean().default(true),
});

export const etsyDeliveryTemplateInputSchema = z.object({
  buyerName: z.string().optional(),
  archiveName: z.string().optional(),
  includeExternalLink: z.boolean().default(false),
  externalLinkAllowed: z.boolean().default(false),
});

export const etsyReportInputSchema = z.object({
  listingTitles: z.array(z.string()).default([]),
  flaggedIssues: z.array(z.string()).default([]),
  recommendedSequence: z.array(z.string()).default([]),
});

export const etsyRevisionStatusInputSchema = z.object({
  orderId: z.string().trim().min(1),
  jobId: z.string().optional(),
  revisionStatus: etsyRevisionStatusSchema,
  revisionNotes: z.string().max(5000).optional(),
  dryRun: z.boolean().default(true),
});

export const etsySafetyCheckSchema = z.object({
  intendedActions: z.array(z.string()).default([]),
  sourceMode: etsyOrderSourceModeSchema.default('MANUAL'),
  deliveryMode: etsyDeliveryModeSchema.optional(),
  externalLinkAllowed: z.boolean().default(false),
  storesPassword: z.boolean().default(false),
  scrapesPrivatePages: z.boolean().default(false),
  automatesBuyerMessages: z.boolean().default(false),
  editsListingsAutomatically: z.boolean().default(false),
});

export type EtsyManualOrderInput = z.infer<typeof etsyManualOrderInputSchema>;
export type EtsyListingImportInput = z.infer<typeof etsyListingImportInputSchema>;
export type EtsyDeliveryTemplateInput = z.infer<typeof etsyDeliveryTemplateInputSchema>;
export type EtsyReportInput = z.infer<typeof etsyReportInputSchema>;
export type EtsyRevisionStatusInput = z.infer<typeof etsyRevisionStatusInputSchema>;
export type EtsySafetyCheckInput = z.infer<typeof etsySafetyCheckSchema>;
