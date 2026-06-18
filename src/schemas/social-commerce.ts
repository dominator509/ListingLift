import { z } from 'zod';
import { DEFAULT_SOCIAL_COMMERCE_CHANNELS } from '@/domain/social-commerce';

export const socialCommerceChannelKeySchema = z.enum([
  'tiktok_shop',
  'instagram_shop',
  'instagram_profile',
  'facebook_marketplace',
  'facebook_business_page',
  'pinterest',
  'tiktok_profile',
  'youtube_shorts',
  'google_business_profile_social',
]);

export const socialCommerceDeliveryModeSchema = z.enum(['PLATFORM_MANUAL_UPLOAD', 'EMAIL_WITH_ALLOWED_LINK', 'DASHBOARD_DOWNLOAD', 'MANUAL_EXTERNAL_DELIVERY_RECORDED']);
export const socialCommerceCreativeFormatSchema = z.enum(['SQUARE_POST', 'VERTICAL_VIDEO_COVER', 'STORY_REEL', 'SHOP_PRODUCT_CARD', 'PINTEREST_PIN', 'MARKETPLACE_SQUARE', 'LOCAL_LISTING_IMAGE']);
export const socialCommerceRevisionStatusSchema = z.enum(['NONE', 'REQUESTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'CLOSED']);

export const socialCommerceManualOrderInputSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  channelKey: socialCommerceChannelKeySchema,
  externalReference: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  buyerName: z.string().optional(),
  buyerHandleOrEmail: z.string().optional(),
  businessName: z.string().optional(),
  packageKey: z.string().optional(),
  packagePurchased: z.string().optional(),
  orderAmountCents: z.number().int().nonnegative().optional(),
  currency: z.string().min(3).max(3).default('USD'),
  deadline: z.string().optional(),
  productNames: z.array(z.string()).default([]),
  imageQuantity: z.number().int().positive().optional(),
  creativeFormats: z.array(socialCommerceCreativeFormatSchema).default([]),
  brandColors: z.array(z.string()).default([]),
  campaignGoal: z.string().optional(),
  deliveryMode: socialCommerceDeliveryModeSchema.default('DASHBOARD_DOWNLOAD'),
  revisionStatus: socialCommerceRevisionStatusSchema.default('NONE'),
  revisionAllowance: z.number().int().nonnegative().optional(),
  externalLinkAllowed: z.boolean().default(false),
  uploadStatus: z.enum(['NOT_STARTED', 'WAITING_FOR_UPLOAD', 'RECEIVED']).default('WAITING_FOR_UPLOAD'),
  notes: z.string().optional(),
  dryRun: z.boolean().default(true),
});

export const socialCommerceMappingInputSchema = z.object({
  channelKey: socialCommerceChannelKeySchema,
  packageKey: z.string(),
  defaultPresetKeys: z.array(z.string()).default([]),
  defaultCreativeFormats: z.array(socialCommerceCreativeFormatSchema).default([]),
  defaultDeliveryMode: socialCommerceDeliveryModeSchema.default('DASHBOARD_DOWNLOAD'),
  manualFallbackOnly: z.boolean().default(true),
  supportsExternalLinks: z.boolean().default(false),
});

export const socialCommerceCreativePlanInputSchema = z.object({
  channelKey: socialCommerceChannelKeySchema,
  productNames: z.array(z.string()).default([]),
  brandColors: z.array(z.string()).default([]),
  formats: z.array(socialCommerceCreativeFormatSchema).default([]),
  campaignGoal: z.string().optional(),
});

export const socialCommerceDeliveryTemplateInputSchema = z.object({
  channelKey: socialCommerceChannelKeySchema,
  buyerName: z.string().optional(),
  archiveName: z.string().optional(),
  includeExternalLink: z.boolean().default(false),
  externalLinkAllowed: z.boolean().default(false),
});

export const socialCommerceRevisionStatusInputSchema = z.object({
  jobId: z.string().optional(),
  channelKey: socialCommerceChannelKeySchema,
  revisionStatus: socialCommerceRevisionStatusSchema,
  revisionNotes: z.string().optional(),
  manualExternalStatus: z.string().optional(),
});

export const socialCommerceSafetyCheckInputSchema = z.object({
  action: z.string(),
  channelKey: socialCommerceChannelKeySchema.optional(),
});

export type SocialCommerceManualOrderInput = z.infer<typeof socialCommerceManualOrderInputSchema>;
export type SocialCommerceMappingInput = z.infer<typeof socialCommerceMappingInputSchema>;
export type SocialCommerceCreativePlanInput = z.infer<typeof socialCommerceCreativePlanInputSchema>;

export const defaultSocialCommerceChannelRecords = DEFAULT_SOCIAL_COMMERCE_CHANNELS;
