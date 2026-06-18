import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS, REQUIRED_SALES_CHANNEL_KEYS } from '@/domain/database-keys';

export const salesChannelPaymentStatusSchema = z.enum(['UNPAID', 'PENDING', 'PAID', 'REFUNDED', 'FAILED', 'MANUAL_CONFIRMED']);
export const salesChannelUploadStatusSchema = z.enum(['NOT_STARTED', 'TOKEN_SENT', 'PARTIAL', 'COMPLETE', 'FAILED']);
export const salesChannelFulfillmentStatusSchema = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'NEEDS_REVIEW', 'APPROVED', 'DELIVERED', 'REVISION', 'COMPLETE', 'FAILED']);
export const salesChannelImportModeSchema = z.enum(['API', 'WEBHOOK', 'EMAIL_PARSER', 'MANUAL', 'CSV_IMPORT']);

export const normalizedExternalOrderSchema = z.object({
  channelName: z.enum(REQUIRED_SALES_CHANNEL_KEYS),
  channelKey: z.enum(REQUIRED_SALES_CHANNEL_KEYS).optional(),
  externalOrderId: z.string().trim().min(1),
  externalCustomerId: z.string().trim().min(1).optional(),
  buyerName: z.string().trim().min(1).optional(),
  buyerEmailOrUsername: z.string().trim().min(1).optional(),
  packagePurchased: z.string().trim().min(1),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).optional(),
  orderAmountCents: z.number().int().nonnegative().optional(),
  currency: z.string().trim().length(3).default('USD'),
  deadline: z.string().datetime().optional(),
  revisionAllowance: z.number().int().nonnegative().default(0),
  sourceUrl: z.string().url().optional(),
  paymentStatus: salesChannelPaymentStatusSchema.default('PENDING'),
  uploadStatus: salesChannelUploadStatusSchema.default('NOT_STARTED'),
  fulfillmentStatus: salesChannelFulfillmentStatusSchema.default('NOT_STARTED'),
  internalClientId: z.string().trim().min(1).optional(),
  internalJobId: z.string().trim().min(1).optional(),
  rawPayload: z.record(z.string(), z.unknown()).optional(),
});

export const salesChannelNormalizationRequestSchema = z.object({
  channelKey: z.string().trim().min(1).default('manual'),
  mode: salesChannelImportModeSchema.default('MANUAL'),
  payload: z.record(z.string(), z.unknown()).default({}),
  organizationId: z.string().trim().min(1).optional(),
  dryRun: z.boolean().default(true),
});

export const manualExternalOrderInputSchema = z.object({
  channelName: z.string().trim().min(1).default('Direct'),
  externalOrderId: z.string().trim().min(1).optional(),
  externalCustomerId: z.string().trim().min(1).optional(),
  buyerName: z.string().trim().min(1).optional(),
  buyerEmailOrUsername: z.string().trim().min(1).optional(),
  email: z.string().trim().min(1).optional(),
  packagePurchased: z.string().trim().min(1).optional(),
  packageKey: z.string().trim().min(1).optional(),
  orderAmount: z.union([z.string(), z.number()]).optional(),
  orderAmountCents: z.union([z.string(), z.number()]).optional(),
  currency: z.string().trim().length(3).default('USD'),
  deadline: z.string().optional(),
  revisionAllowance: z.union([z.string(), z.number()]).optional(),
  sourceUrl: z.string().optional(),
  paymentStatus: z.string().optional(),
  uploadStatus: z.string().optional(),
  fulfillmentStatus: z.string().optional(),
  internalClientId: z.string().trim().min(1).optional(),
  internalJobId: z.string().trim().min(1).optional(),
});

export const clientMatchDraftSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  matchStrategy: z.enum(['internal_client_id', 'email', 'external_customer_id', 'buyer_username', 'new_client']),
  confidence: z.number().min(0).max(1),
  name: z.string(),
  email: z.string().optional(),
  sourceChannel: z.string(),
  externalCustomerId: z.string().optional(),
});

export const externalOrderPersistedDraftSchema = z.object({
  organizationId: z.string(),
  salesChannelKey: z.string(),
  dedupeKey: z.string(),
  externalOrderId: z.string(),
  externalCustomerId: z.string().optional(),
  clientId: z.string().optional(),
  packageKey: z.string().optional(),
  buyerName: z.string().optional(),
  buyerEmailOrUsername: z.string().optional(),
  orderAmountCents: z.number().optional(),
  currency: z.string(),
  deadline: z.string().optional(),
  revisionAllowance: z.number(),
  sourceUrl: z.string().optional(),
  paymentStatus: salesChannelPaymentStatusSchema,
  uploadStatus: salesChannelUploadStatusSchema,
  fulfillmentStatus: salesChannelFulfillmentStatusSchema,
  normalizedPayload: z.record(z.string(), z.unknown()),
});

export const normalizedJobDraftSchema = z.object({
  organizationId: z.string(),
  clientId: z.string().optional(),
  salesChannelKey: z.string(),
  externalOrderDedupeKey: z.string(),
  packageKey: z.string().optional(),
  title: z.string(),
  status: z.literal('WAITING_FOR_UPLOAD'),
  paymentStatus: salesChannelPaymentStatusSchema,
  uploadStatus: salesChannelUploadStatusSchema,
  fulfillmentStatus: salesChannelFulfillmentStatusSchema,
  deadline: z.string().optional(),
  revisionAllowance: z.number(),
  sourceUrl: z.string().optional(),
  revenueAttribution: z.record(z.string(), z.unknown()),
});

export const revenueAttributionDraftSchema = z.object({
  channelName: z.string(),
  externalOrderId: z.string(),
  grossAmountCents: z.number().int().nonnegative().default(0),
  currency: z.string().length(3),
  packageKey: z.string().optional(),
  attributionSource: z.enum(['checkout', 'webhook', 'manual', 'csv_import', 'email_parser', 'api']),
  sourceUrl: z.string().optional(),
});

export type NormalizedExternalOrder = z.infer<typeof normalizedExternalOrderSchema>;
export type SalesChannelNormalizationRequest = z.infer<typeof salesChannelNormalizationRequestSchema>;
export type ClientMatchDraft = z.infer<typeof clientMatchDraftSchema>;
export type ExternalOrderPersistedDraft = z.infer<typeof externalOrderPersistedDraftSchema>;
export type NormalizedJobDraft = z.infer<typeof normalizedJobDraftSchema>;
export type RevenueAttributionDraft = z.infer<typeof revenueAttributionDraftSchema>;
