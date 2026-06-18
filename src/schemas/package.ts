import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS, REQUIRED_SALES_CHANNEL_KEYS } from '@/domain/database-keys';

export const packageKeySchema = z.enum(REQUIRED_PACKAGE_KEYS);
export const packageCategorySchema = z.enum(['quick_cleanup', 'marketplace_listing', 'product_launch', 'retainer', 'agency', 'custom']);
export const packageCheckoutModeSchema = z.enum(['direct_checkout', 'manual_quote', 'subscription_inquiry', 'volume_quote']);
export const billingIntervalSchema = z.enum(['one_time', 'month', 'volume', 'custom']).nullable();
export const salesChannelKeySchema = z.enum(REQUIRED_SALES_CHANNEL_KEYS);

export const packagePricePolicySchema = z.object({
  baseImageAllowance: z.number().int().positive().nullable(),
  overagePriceCents: z.number().int().nonnegative().nullable(),
  rushAvailable: z.boolean(),
  rushFeeCents: z.number().int().nonnegative().nullable(),
  requiresManualQuoteAboveImages: z.number().int().positive().nullable(),
});

export const packageSchema = z.object({
  key: packageKeySchema,
  publicSlug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  shortName: z.string().min(2),
  category: packageCategorySchema,
  description: z.string().min(10),
  positioning: z.string().min(10),
  imageMin: z.number().int().nonnegative().nullable(),
  imageMax: z.number().int().nonnegative().nullable(),
  imageAllowance: z.number().int().nonnegative().nullable(),
  priceMinCents: z.number().int().nonnegative().nullable(),
  priceMaxCents: z.number().int().nonnegative().nullable(),
  currency: z.literal('USD').default('USD'),
  billingInterval: billingIntervalSchema,
  checkoutMode: packageCheckoutModeSchema,
  deliveryWindowDays: z.number().int().positive().nullable(),
  revisionAllowance: z.number().int().nonnegative(),
  includedOutputTypes: z.array(z.string().min(1)),
  defaultSalesChannelKeys: z.array(salesChannelKeySchema),
  features: z.array(z.string().min(1)).min(1),
  recommendedFor: z.array(z.string().min(1)).min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  pricePolicy: packagePricePolicySchema,
  safeClaim: z.string().min(20),
  upsellPackageKeys: z.array(packageKeySchema),
  popular: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  active: z.boolean(),
  manualReviewRequired: z.boolean(),
});

export const packageAdminUpdateSchema = packageSchema.partial().extend({
  key: packageKeySchema,
  changeReason: z.string().min(5),
}).refine((value) => value.priceMaxCents == null || value.priceMinCents == null || value.priceMaxCents >= value.priceMinCents, {
  message: 'priceMaxCents must be greater than or equal to priceMinCents',
  path: ['priceMaxCents'],
});

export const packageQuoteRequestSchema = z.object({
  packageKey: packageKeySchema,
  imageQuantity: z.number().int().positive(),
  salesChannelKey: salesChannelKeySchema.optional(),
  rushRequested: z.boolean().default(false),
  needsBrandBackgrounds: z.boolean().default(false),
  needsManualEditing: z.boolean().default(false),
});

export const packageCheckoutSelectionSchema = z.object({
  packageKey: packageKeySchema,
  buyerName: z.string().min(2),
  buyerEmail: z.string().email(),
  businessName: z.string().min(2).optional(),
  targetPlatform: z.string().min(2).optional(),
  imageQuantity: z.number().int().positive(),
  salesChannelKey: salesChannelKeySchema.default('Direct'),
  deadline: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export type PackageInput = z.infer<typeof packageSchema>;
export type PackageAdminUpdateInput = z.infer<typeof packageAdminUpdateSchema>;
export type PackageQuoteRequest = z.infer<typeof packageQuoteRequestSchema>;
export type PackageCheckoutSelection = z.infer<typeof packageCheckoutSelectionSchema>;
