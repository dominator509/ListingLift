import { z } from 'zod';
import { REQUIRED_PRESET_KEYS } from '@/domain/database-keys';

export const requiredPlatformPresetKeySchema = z.enum(REQUIRED_PRESET_KEYS);
export const platformPresetKeySchema = z.string().min(2).max(120).regex(/^[A-Za-z0-9_-]+$/, 'Preset key must be URL/file safe.');
export const outputFormatSchema = z.enum(['JPG', 'PNG', 'WEBP', 'CSV', 'TXT', 'ZIP', 'PDF']);
export const backgroundTypeSchema = z.enum(['WHITE', 'TRANSPARENT', 'BRAND_COLOR', 'ORIGINAL', 'SOFT_SHADOW', 'CUSTOM']);
export const presetOrientationSchema = z.enum(['square', 'vertical', 'horizontal', 'custom']);
export const presetQualityCheckSchema = z.enum([
  'edge_quality',
  'product_not_cut_off',
  'background_matches_requirement',
  'safe_margin',
  'target_dimensions',
  'file_size',
  'format',
  'naming',
  'folder_destination',
  'seller_review_required',
]);

export const presetFolderDestinationSchema = z.object({
  rootFolder: z.string().min(1).max(120),
  platformFolder: z.string().min(1).max(120),
  outputFolder: z.string().min(1).max(120),
});

export const platformPresetSchema = z.object({
  key: platformPresetKeySchema,
  requiredKey: requiredPlatformPresetKeySchema.optional(),
  platform: z.string().min(1).max(120),
  platformKey: z.string().min(1).max(120),
  name: z.string().min(2).max(160),
  description: z.string().min(1).max(500),
  width: z.number().int().min(64).max(10000),
  height: z.number().int().min(64).max(10000),
  aspectRatio: z.string().min(1).max(20),
  orientation: presetOrientationSchema,
  format: outputFormatSchema,
  folderPath: z.string().min(1).max(240).refine((path) => !path.includes('..') && !path.startsWith('/') && !/^[a-z]:/i.test(path), 'Folder path must be relative and cannot traverse directories.'),
  folderDestination: presetFolderDestinationSchema,
  background: backgroundTypeSchema,
  compressionTargetKb: z.number().int().positive().nullable(),
  maxFileSizeKb: z.number().int().positive().nullable(),
  safeMarginPercent: z.number().min(0).max(25),
  namingConvention: z.string().min(1).max(180).refine((value) => value.includes('{index}'), 'Naming convention must include {index}.'),
  recommendedUse: z.string().min(1).max(400),
  qualityChecks: z.array(presetQualityCheckSchema).min(1),
  channelTags: z.array(z.string().min(1)).default([]),
  safeLanguage: z.string().min(1).refine((value) => value.toLowerCase().includes('seller-review'), 'Safe language must include seller-review wording.'),
  marketplaceSafeClaim: z.string().min(1).refine((value) => !/guarantee|guaranteed|compliant|approval|ranking|conversion increase|sales increase/i.test(value), 'Marketplace claim cannot guarantee compliance, approval, ranking, conversion, or sales.'),
  sellerReviewRequired: z.boolean(),
  supportsTransparent: z.boolean(),
  supportsWhiteBackground: z.boolean(),
  editable: z.boolean(),
  active: z.boolean(),
  system: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export const platformPresetCreateSchema = platformPresetSchema.omit({
  requiredKey: true,
  system: true,
  sortOrder: true,
}).extend({
  key: platformPresetKeySchema.optional(),
  system: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(900),
  changeReason: z.string().min(8).max(500),
});

export const platformPresetAdminUpdateSchema = platformPresetSchema.partial().extend({
  key: platformPresetKeySchema,
  changeReason: z.string().min(8).max(500),
});

export const customPresetDraftSchema = z.object({
  organizationSlug: z.string().min(2).max(80),
  name: z.string().min(2).max(120),
  platform: z.string().min(1).max(120).optional(),
  width: z.number().int().min(64).max(10000),
  height: z.number().int().min(64).max(10000),
  format: outputFormatSchema,
  background: backgroundTypeSchema,
  folderPath: z.string().min(1).max(240),
  namingConvention: z.string().min(1).max(180).optional(),
  safeMarginPercent: z.number().min(0).max(25).optional(),
  changeReason: z.string().min(8).max(500),
});

export const presetSelectionRequestSchema = z.object({
  targetPlatforms: z.array(z.string().min(1)).default([]),
  selectedPresetKeys: z.array(platformPresetKeySchema).default([]),
  includeTransparentPng: z.boolean().default(true),
  includeWhiteJpg: z.boolean().default(true),
  includeSocialCommerce: z.boolean().default(false),
});

export type PlatformPresetInput = z.infer<typeof platformPresetSchema>;
export type PlatformPresetCreateInput = z.infer<typeof platformPresetCreateSchema>;
export type PlatformPresetAdminUpdateInput = z.infer<typeof platformPresetAdminUpdateSchema>;
export type CustomPresetDraftInput = z.infer<typeof customPresetDraftSchema>;
export type PresetSelectionRequest = z.infer<typeof presetSelectionRequestSchema>;
