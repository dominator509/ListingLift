import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS } from '@/domain/database-keys';

export const shopifySourceModeSchema = z.enum(['MANUAL', 'CSV_IMPORT', 'API_SCAFFOLD', 'OAUTH_APP_SCAFFOLD', 'WEBHOOK_SCAFFOLD']);
export const shopifyWorkflowStatusSchema = z.enum(['DRAFT', 'STORE_CAPTURED', 'PRODUCT_EXPORT_NEEDED', 'PRODUCT_CSV_IMPORTED', 'FILES_NEEDED', 'FILES_RECEIVED', 'PROCESSING', 'WAITING_FOR_QC', 'WAITING_FOR_APPROVAL', 'REPLACEMENT_APPROVAL_NEEDED', 'DELIVERY_READY', 'DELIVERED_TO_MERCHANT', 'REVISION_REQUESTED', 'STORE_REFRESH_UPSELL_READY', 'COMPLETED', 'CANCELLED', 'FAILED']);
export const shopifyProductImportModeSchema = z.enum(['MANUAL_CSV', 'PRODUCT_EXPORT_CSV', 'API_SCAFFOLD', 'OAUTH_APP_SCAFFOLD']);
export const shopifyDeliveryModeSchema = z.enum(['SHOPIFY_ADMIN_MANUAL_UPLOAD', 'SHOPIFY_FILE_IMPORT_GUIDE', 'EMAIL_WITH_ALLOWED_LINK', 'MANUAL_EXTERNAL_DELIVERY_RECORDED']);
export const shopifyImageReplacementApprovalStatusSchema = z.enum(['NOT_REQUESTED', 'PENDING_MERCHANT_REVIEW', 'APPROVED_FOR_MANUAL_UPLOAD', 'REJECTED', 'REPLACED_MANUALLY', 'CLOSED']);
export const shopifyOAuthStatusSchema = z.enum(['NOT_CONFIGURED', 'SCAFFOLD_ONLY', 'PENDING_APP_REVIEW', 'CONNECTED_TEST_STORE', 'CONNECTED_PRODUCTION_STORE', 'DISABLED']);

const amountToCents = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Math.round(value * 100);
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : undefined;
});

export const shopifyManualOrderInputSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  storeDomain: z.string().trim().min(1),
  storeName: z.string().trim().optional(),
  merchantName: z.string().trim().optional(),
  merchantEmail: z.string().trim().optional(),
  productIds: z.array(z.string().trim().min(1)).default([]),
  skus: z.array(z.string().trim().min(1)).default([]),
  productTitles: z.array(z.string().trim().min(1)).default([]),
  productCategory: z.string().trim().optional(),
  packagePurchased: z.string().trim().optional(),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).optional(),
  shopifyPackKey: z.string().trim().optional(),
  imageQuantity: z.number().int().positive().optional(),
  orderAmount: amountToCents,
  orderAmountCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  deadline: z.string().datetime().optional(),
  revisionAllowance: z.number().int().nonnegative().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().max(5000).optional(),
  deliveryMode: shopifyDeliveryModeSchema.default('SHOPIFY_FILE_IMPORT_GUIDE'),
  replacementApprovalStatus: shopifyImageReplacementApprovalStatusSchema.default('NOT_REQUESTED'),
  externalLinkAllowed: z.boolean().default(false),
  uploadStatus: z.enum(['NOT_STARTED', 'WAITING_FOR_UPLOAD', 'RECEIVED', 'PARTIAL', 'FAILED']).default('WAITING_FOR_UPLOAD'),
  sourceMode: shopifySourceModeSchema.default('MANUAL'),
  dryRun: z.boolean().default(true),
});

export const shopifyProductCsvImportInputSchema = z.object({
  organizationId: z.string().optional(),
  storeDomain: z.string().trim().min(1),
  storeName: z.string().trim().optional(),
  importMode: shopifyProductImportModeSchema.default('PRODUCT_EXPORT_CSV'),
  productRows: z.array(z.object({
    productId: z.string().trim().optional(),
    handle: z.string().trim().optional(),
    title: z.string().trim().min(1),
    sku: z.string().trim().optional(),
    variantId: z.string().trim().optional(),
    productType: z.string().trim().optional(),
    vendor: z.string().trim().optional(),
    imageCount: z.number().int().nonnegative().optional(),
    sourceUrl: z.string().url().optional().or(z.literal('')),
  })).default([]),
  dryRun: z.boolean().default(true),
});

export const shopifyDeliveryTemplateInputSchema = z.object({
  merchantName: z.string().optional(),
  archiveName: z.string().optional(),
  storeDomain: z.string().optional(),
  includeExternalLink: z.boolean().default(false),
  externalLinkAllowed: z.boolean().default(false),
});

export const shopifyProductAuditInputSchema = z.object({
  productTitles: z.array(z.string()).default([]),
  flaggedIssues: z.array(z.string()).default([]),
  recommendedSequence: z.array(z.string()).default([]),
  consistencyScore: z.number().int().min(0).max(150).optional(),
});

export const shopifyReplacementApprovalInputSchema = z.object({
  storeDomain: z.string().trim().min(1),
  productId: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  processedFileIds: z.array(z.string()).default([]),
  approvalStatus: shopifyImageReplacementApprovalStatusSchema,
  merchantNotes: z.string().max(5000).optional(),
  dryRun: z.boolean().default(true),
});

export const shopifyOAuthScaffoldInputSchema = z.object({
  storeDomain: z.string().trim().min(1),
  requestedScopes: z.array(z.string()).default(['read_products', 'write_products', 'read_files', 'write_files']),
  oauthStatus: shopifyOAuthStatusSchema.default('SCAFFOLD_ONLY'),
  dryRun: z.boolean().default(true),
});

export const shopifySafetyCheckSchema = z.object({
  intendedActions: z.array(z.string()).default([]),
  sourceMode: shopifySourceModeSchema.default('MANUAL'),
  deliveryMode: shopifyDeliveryModeSchema.optional(),
  oauthStatus: shopifyOAuthStatusSchema.optional(),
  externalLinkAllowed: z.boolean().default(false),
  storesPassword: z.boolean().default(false),
  scrapesPrivatePages: z.boolean().default(false),
  autoReplacesImages: z.boolean().default(false),
  hasMerchantApprovalForReplacement: z.boolean().default(false),
  exposesOauthTokenToFrontend: z.boolean().default(false),
});

export type ShopifyManualOrderInput = z.infer<typeof shopifyManualOrderInputSchema>;
export type ShopifyProductCsvImportInput = z.infer<typeof shopifyProductCsvImportInputSchema>;
export type ShopifyDeliveryTemplateInput = z.infer<typeof shopifyDeliveryTemplateInputSchema>;
export type ShopifyProductAuditInput = z.infer<typeof shopifyProductAuditInputSchema>;
export type ShopifyReplacementApprovalInput = z.infer<typeof shopifyReplacementApprovalInputSchema>;
export type ShopifyOAuthScaffoldInput = z.infer<typeof shopifyOAuthScaffoldInputSchema>;
export type ShopifySafetyCheckInput = z.infer<typeof shopifySafetyCheckSchema>;
