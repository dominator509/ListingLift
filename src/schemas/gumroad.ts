import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS } from '@/domain/database-keys';

export const gumroadFulfillmentKindSchema = z.enum(['IMAGE_PACK_JOB', 'CREDIT_PACK', 'DIGITAL_DOWNLOAD', 'DASHBOARD_ACCESS', 'AGENCY_STARTER']);
export const gumroadWebhookProcessingStatusSchema = z.enum(['RECEIVED', 'VERIFIED', 'DUPLICATE', 'MAPPED', 'JOB_CREATED', 'CREDITS_APPLIED', 'UPLOAD_LINK_PLANNED', 'IGNORED', 'FAILED', 'REFUNDED']);

const flexibleBoolean = z.union([z.boolean(), z.string(), z.number()]).optional().transform((value) => value === true || value === 'true' || value === 1 || value === '1');
const flexibleAmount = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (typeof value === 'number') return Math.round(value * 100);
  if (!value) return undefined;
  const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : undefined;
});

export const gumroadSalePayloadSchema = z.object({
  sale_id: z.string().trim().min(1).optional(),
  id: z.string().trim().min(1).optional(),
  order_number: z.union([z.string(), z.number()]).optional(),
  seller_id: z.string().optional(),
  product_id: z.string().optional(),
  product_name: z.string().optional(),
  permalink: z.string().optional(),
  short_product_id: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  full_name: z.string().optional(),
  price: flexibleAmount,
  price_cents: z.union([z.string(), z.number()]).optional().transform((value) => value === undefined ? undefined : Number(value)),
  currency: z.string().trim().length(3).optional().default('USD'),
  sale_timestamp: z.string().optional(),
  purchase_email: z.string().email().optional().or(z.literal('')),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
  variants: z.string().optional(),
  refunded: flexibleBoolean,
  chargebacked: flexibleBoolean,
  disputed: flexibleBoolean,
  dispute_won: flexibleBoolean,
  test: flexibleBoolean,
}).passthrough();

export const gumroadOfferMappingSchema = z.object({
  key: z.string().trim().min(1),
  label: z.string().trim().min(1),
  productId: z.string().optional(),
  permalink: z.string().optional(),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).nullable(),
  imageAllowance: z.number().int().nonnegative().nullable(),
  creditAmount: z.number().int().nonnegative(),
  revisionAllowance: z.number().int().nonnegative(),
  fulfillmentKind: gumroadFulfillmentKindSchema,
  createsJob: z.boolean(),
  sendsUploadLink: z.boolean(),
  sendsAdminNotification: z.boolean(),
  active: z.boolean().default(true),
});

export const gumroadWebhookEnvelopeSchema = z.object({
  payload: gumroadSalePayloadSchema,
  signatureHeader: z.string().optional().default(''),
  webhookSecretConfigured: z.boolean().default(false),
  dryRun: z.boolean().default(true),
});

export const gumroadNormalizedPurchaseSchema = z.object({
  provider: z.literal('gumroad'),
  saleId: z.string().trim().min(1),
  dedupeKey: z.string().trim().min(1),
  productId: z.string().optional(),
  productName: z.string().optional(),
  permalink: z.string().optional(),
  buyerEmail: z.string().optional(),
  buyerName: z.string().optional(),
  amountCents: z.number().int().nonnegative().default(0),
  currency: z.string().length(3).default('USD'),
  paymentStatus: z.enum(['PAID', 'REFUNDED', 'FAILED', 'PENDING']).default('PAID'),
  rawPayload: z.record(z.string(), z.unknown()),
});

export const gumroadPurchaseIntakeRequestSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  payload: gumroadSalePayloadSchema,
  dryRun: z.boolean().default(true),
});

export type GumroadSalePayload = z.infer<typeof gumroadSalePayloadSchema>;
export type GumroadWebhookEnvelope = z.infer<typeof gumroadWebhookEnvelopeSchema>;
export type GumroadNormalizedPurchase = z.infer<typeof gumroadNormalizedPurchaseSchema>;
export type GumroadPurchaseIntakeRequest = z.infer<typeof gumroadPurchaseIntakeRequestSchema>;
