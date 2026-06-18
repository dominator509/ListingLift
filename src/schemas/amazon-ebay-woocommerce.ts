import { z } from 'zod';
import { DEFAULT_MARKETPLACE_EXPORT_CHANNELS } from '@/domain/amazon-ebay-woocommerce';

export const marketplaceExportChannelKeySchema = z.enum(['amazon_manual', 'ebay_manual', 'woocommerce_manual']);
export const marketplaceExportDeliveryModeSchema = z.enum(['PLATFORM_MANUAL_UPLOAD', 'SELLER_EXPORT_PACKAGE', 'DASHBOARD_DOWNLOAD', 'MANUAL_EXTERNAL_DELIVERY_RECORDED']);
export const marketplaceImageRoleSchema = z.enum([
  'AMAZON_MAIN_IMAGE_DRAFT',
  'AMAZON_SECONDARY_IMAGE_DRAFT',
  'EBAY_LISTING_SQUARE',
  'EBAY_MULTI_ANGLE',
  'WOOCOMMERCE_PRODUCT_GALLERY',
  'WOOCOMMERCE_THUMBNAIL',
  'TRANSPARENT_CUTOUT',
  'WHITE_BACKGROUND_JPG',
]);
export const marketplaceRevisionStatusSchema = z.enum(['NONE', 'REQUESTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'CLOSED']);

export const marketplaceManualOrderInputSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  channelKey: marketplaceExportChannelKeySchema,
  storeName: z.string().optional(),
  sellerName: z.string().optional(),
  buyerName: z.string().optional(),
  buyerEmailOrUsername: z.string().optional(),
  externalReference: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  packageKey: z.string().optional(),
  packagePurchased: z.string().optional(),
  orderAmountCents: z.number().int().nonnegative().optional(),
  currency: z.string().min(3).max(3).default('USD'),
  deadline: z.string().optional(),
  sku: z.string().optional(),
  productNames: z.array(z.string()).default([]),
  imageQuantity: z.number().int().positive().optional(),
  imageRoles: z.array(marketplaceImageRoleSchema).default([]),
  presetKeys: z.array(z.string()).default([]),
  deliveryMode: marketplaceExportDeliveryModeSchema.default('SELLER_EXPORT_PACKAGE'),
  revisionStatus: marketplaceRevisionStatusSchema.default('NONE'),
  sellerReviewRequired: z.boolean().default(true),
  externalLinkAllowed: z.boolean().default(false),
  notes: z.string().optional(),
  dryRun: z.boolean().default(true),
});

export const marketplaceMappingInputSchema = z.object({
  channelKey: marketplaceExportChannelKeySchema,
  packageKey: z.string(),
  defaultPresetKeys: z.array(z.string()).default([]),
  defaultImageRoles: z.array(marketplaceImageRoleSchema).default([]),
  defaultDeliveryMode: marketplaceExportDeliveryModeSchema.default('SELLER_EXPORT_PACKAGE'),
  sellerReviewRequired: z.boolean().default(true),
});

export const marketplaceExportPlanInputSchema = z.object({
  channelKey: marketplaceExportChannelKeySchema,
  storeName: z.string().optional(),
  sku: z.string().optional(),
  productNames: z.array(z.string()).default([]),
  presetKeys: z.array(z.string()).default([]),
  imageRoles: z.array(marketplaceImageRoleSchema).default([]),
  includeCsvManifest: z.boolean().default(true),
  includeReadme: z.boolean().default(true),
});

export const marketplaceDeliveryTemplateInputSchema = z.object({
  channelKey: marketplaceExportChannelKeySchema,
  sellerName: z.string().optional(),
  archiveName: z.string().optional(),
  includeExternalLink: z.boolean().default(false),
  externalLinkAllowed: z.boolean().default(false),
});

export const marketplaceRevisionStatusInputSchema = z.object({
  jobId: z.string().optional(),
  channelKey: marketplaceExportChannelKeySchema,
  revisionStatus: marketplaceRevisionStatusSchema,
  revisionNotes: z.string().optional(),
  manualExternalStatus: z.string().optional(),
});

export const marketplaceComplianceWarningInputSchema = z.object({
  channelKey: marketplaceExportChannelKeySchema,
  imageRoles: z.array(marketplaceImageRoleSchema).default([]),
  presetKeys: z.array(z.string()).default([]),
  categoryNotes: z.string().optional(),
});

export const marketplaceSafetyCheckInputSchema = z.object({
  action: z.string(),
  channelKey: marketplaceExportChannelKeySchema.optional(),
});

export type MarketplaceManualOrderInput = z.infer<typeof marketplaceManualOrderInputSchema>;
export type MarketplaceExportPlanInput = z.infer<typeof marketplaceExportPlanInputSchema>;
export type MarketplaceDeliveryTemplateInput = z.infer<typeof marketplaceDeliveryTemplateInputSchema>;
export type MarketplaceComplianceWarningInput = z.infer<typeof marketplaceComplianceWarningInputSchema>;

export const defaultMarketplaceExportChannelRecords = DEFAULT_MARKETPLACE_EXPORT_CHANNELS;
