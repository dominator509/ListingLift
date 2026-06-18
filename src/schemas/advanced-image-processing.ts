import { z } from 'zod';

export const advancedImageOperationKeySchema = z.enum([
  'AUTO_ENHANCE',
  'LIGHTING_BALANCE',
  'WHITE_BALANCE',
  'SHARPEN',
  'DENOISE',
  'SOFT_SHADOW',
  'REFLECTION_SHADOW',
  'BRAND_BACKGROUND',
  'HERO_COMPOSITE',
  'SOCIAL_VARIATION',
  'THUMBNAIL_VARIATION',
  'SEQUENCE_RECOMMENDATION',
  'QUALITY_REPORT',
]);

export const advancedImageRecipeKeySchema = z.enum([
  'marketplace-polish',
  'brand-background-set',
  'launch-hero-social-set',
  'thumbnail-variation-set',
  'quality-report-only',
]);

export const advancedImageSourceFileSchema = z.object({
  imageId: z.string().min(1),
  processedFileId: z.string().min(1).optional(),
  originalFilename: z.string().min(1),
  sku: z.string().optional(),
  productName: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  status: z.enum(['READY_FOR_REVIEW', 'APPROVED', 'FLAGGED', 'FAILED', 'REJECTED']).default('READY_FOR_REVIEW'),
});

export const advancedImagePlanRequestSchema = z.object({
  organizationId: z.string().optional(),
  jobId: z.string().min(1),
  recipeKey: advancedImageRecipeKeySchema,
  operationKeys: z.array(advancedImageOperationKeySchema).optional(),
  sourceFiles: z.array(advancedImageSourceFileSchema).min(1),
  brandColors: z.array(z.string()).default([]),
  targetPlatforms: z.array(z.string()).default([]),
  includeQualityReport: z.boolean().default(true),
  includeSequenceRecommendations: z.boolean().default(false),
  manualFallbackAllowed: z.boolean().default(true),
});

export const advancedImageQueueRequestSchema = z.object({
  jobId: z.string().min(1),
  recipeKey: advancedImageRecipeKeySchema,
  sourceImageIds: z.array(z.string().min(1)).min(1),
  notes: z.string().max(2000).optional(),
  dryRun: z.boolean().default(true),
});

export const advancedImageSafetyCheckRequestSchema = z.object({
  operationKeys: z.array(advancedImageOperationKeySchema).min(1),
  proposedCopy: z.string().max(4000).optional(),
  includesAutoPublish: z.boolean().default(false),
  includesProductAlteration: z.boolean().default(false),
  exposesClientFiles: z.boolean().default(false),
  exposesUnapprovedOutputs: z.boolean().default(false),
});

export type AdvancedImagePlanRequest = z.infer<typeof advancedImagePlanRequestSchema>;
export type AdvancedImageQueueRequest = z.infer<typeof advancedImageQueueRequestSchema>;
export type AdvancedImageSafetyCheckRequest = z.infer<typeof advancedImageSafetyCheckRequestSchema>;
