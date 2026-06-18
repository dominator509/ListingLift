import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS } from '@/domain/database-keys';

export const fiverrWorkflowStatusSchema = z.enum([
  'DRAFT', 'ORDER_CAPTURED', 'FILES_NEEDED', 'FILES_RECEIVED', 'PROCESSING', 'WAITING_FOR_REVIEW', 'FLAGGED', 'APPROVED', 'DELIVERY_READY', 'DELIVERED_IN_FIVERR', 'REVISION_REQUESTED', 'REPROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED',
]);
export const fiverrDeliveryModeSchema = z.enum(['FIVERR_ATTACHMENT', 'FIVERR_MESSAGE_WITH_ALLOWED_LINK', 'MANUAL_EXTERNAL_DELIVERY_RECORDED']);
export const fiverrRevisionStatusSchema = z.enum(['NONE', 'REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'CLOSED']);

const amountToCents = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Math.round(value * 100);
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : undefined;
});

export const fiverrManualOrderInputSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  orderId: z.string().trim().min(1),
  buyerUsername: z.string().trim().min(1),
  buyerName: z.string().trim().optional(),
  gigTitle: z.string().trim().min(1),
  packagePurchased: z.string().trim().optional(),
  tierKey: z.string().trim().optional(),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).optional(),
  orderAmount: amountToCents,
  orderAmountCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  deadline: z.string().datetime().optional(),
  revisionAllowance: z.number().int().nonnegative().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  orderInstructions: z.string().max(5000).optional(),
  uploadStatus: z.enum(['NOT_STARTED', 'WAITING_FOR_UPLOAD', 'RECEIVED', 'PARTIAL', 'FAILED']).default('WAITING_FOR_UPLOAD'),
  dryRun: z.boolean().default(true),
});

export const fiverrGigMappingSchema = z.object({
  key: z.string().trim().min(1),
  gigTitle: z.string().trim().min(1),
  searchHints: z.array(z.string()).default([]),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS),
  imageAllowance: z.number().int().nonnegative(),
  revisionAllowance: z.number().int().nonnegative(),
  defaultTurnaroundDays: z.number().int().positive(),
  deliveryMode: fiverrDeliveryModeSchema,
  createsUploadLink: z.boolean().default(true),
  deliveryTemplateKey: z.string().trim().min(1),
  active: z.boolean().default(true),
  safeDescription: z.string().trim().min(1),
});

export const fiverrDeliveryTemplateInputSchema = z.object({
  buyerUsername: z.string().optional(),
  jobNumber: z.string().optional(),
  archiveFileName: z.string().optional(),
  deliveryMode: fiverrDeliveryModeSchema.default('FIVERR_ATTACHMENT'),
  includeExternalLink: z.boolean().default(false),
  externalLinkAllowed: z.boolean().default(false),
});

export const fiverrRevisionUpdateSchema = z.object({
  orderId: z.string().trim().min(1),
  jobId: z.string().optional(),
  revisionStatus: fiverrRevisionStatusSchema,
  revisionNotes: z.string().max(5000).optional(),
  requestedAt: z.string().datetime().optional(),
  dryRun: z.boolean().default(true),
});

export const fiverrSafetyCheckSchema = z.object({
  intendedActions: z.array(z.string()).default([]),
  deliveryMode: fiverrDeliveryModeSchema.optional(),
  externalLinkAllowed: z.boolean().default(false),
});

export type FiverrManualOrderInput = z.infer<typeof fiverrManualOrderInputSchema>;
export type FiverrGigMappingInput = z.infer<typeof fiverrGigMappingSchema>;
export type FiverrDeliveryTemplateInput = z.infer<typeof fiverrDeliveryTemplateInputSchema>;
export type FiverrRevisionUpdateInput = z.infer<typeof fiverrRevisionUpdateSchema>;
