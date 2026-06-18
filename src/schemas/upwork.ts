import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS } from '@/domain/database-keys';

export const upworkContractTypeSchema = z.enum(['FIXED_PRICE', 'HOURLY', 'RETAINER', 'AGENCY_SUBCONTRACT', 'BULK_CATALOG']);
export const upworkMilestoneStatusSchema = z.enum(['NONE', 'PROPOSED', 'ACTIVE', 'SUBMITTED', 'APPROVED', 'PAID', 'PAUSED', 'CLOSED', 'DISPUTED']);
export const upworkWorkflowStatusSchema = z.enum([
  'DRAFT', 'CONTRACT_CAPTURED', 'FILES_NEEDED', 'FILES_RECEIVED', 'PROCESSING', 'WAITING_FOR_REVIEW', 'FLAGGED', 'APPROVED', 'DELIVERY_READY', 'DELIVERED_IN_UPWORK', 'REVISION_REQUESTED', 'REPROCESSING', 'RETAINER_REMINDER_SENT', 'COMPLETED', 'CANCELLED', 'FAILED',
]);
export const upworkDeliveryModeSchema = z.enum(['UPWORK_ATTACHMENT', 'UPWORK_MESSAGE_WITH_ALLOWED_LINK', 'MANUAL_EXTERNAL_DELIVERY_RECORDED']);
export const upworkRevisionStatusSchema = z.enum(['NONE', 'REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'CLOSED']);

const amountToCents = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Math.round(value * 100);
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : undefined;
});

export const upworkManualContractInputSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  contractId: z.string().trim().min(1),
  clientName: z.string().trim().min(1),
  clientCompany: z.string().trim().optional(),
  clientUsername: z.string().trim().optional(),
  contractTitle: z.string().trim().min(1),
  contractType: upworkContractTypeSchema.default('FIXED_PRICE'),
  milestoneTitle: z.string().trim().optional(),
  milestoneStatus: upworkMilestoneStatusSchema.default('ACTIVE'),
  dueDate: z.string().datetime().optional(),
  billedAmount: amountToCents,
  billedAmountCents: z.number().int().nonnegative().optional(),
  hourlyRate: amountToCents,
  hourlyRateCents: z.number().int().nonnegative().optional(),
  estimatedHours: z.number().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  contractNotes: z.string().max(5000).optional(),
  packagePurchased: z.string().trim().optional(),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).optional(),
  offerKey: z.string().trim().optional(),
  revisionAllowance: z.number().int().nonnegative().optional(),
  uploadStatus: z.enum(['NOT_STARTED', 'WAITING_FOR_UPLOAD', 'RECEIVED', 'PARTIAL', 'FAILED']).default('WAITING_FOR_UPLOAD'),
  dryRun: z.boolean().default(true),
});

export const upworkOfferMappingSchema = z.object({
  key: z.string().trim().min(1),
  contractType: upworkContractTypeSchema,
  title: z.string().trim().min(1),
  searchHints: z.array(z.string()).default([]),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS),
  imageAllowance: z.number().int().nonnegative(),
  revisionAllowance: z.number().int().nonnegative(),
  defaultTurnaroundDays: z.number().int().positive(),
  defaultMilestoneStatus: upworkMilestoneStatusSchema,
  deliveryMode: upworkDeliveryModeSchema,
  createsUploadLink: z.boolean().default(true),
  proposalTemplateKey: z.string().trim().min(1),
  deliveryTemplateKey: z.string().trim().min(1),
  retainerReminderEnabled: z.boolean().default(false),
  active: z.boolean().default(true),
  safeDescription: z.string().trim().min(1),
});

export const upworkProposalTemplateInputSchema = z.object({
  clientName: z.string().optional(),
  contractTitle: z.string().optional(),
  contractType: upworkContractTypeSchema.default('FIXED_PRICE'),
  packageLabel: z.string().optional(),
  imageAllowance: z.number().int().positive().optional(),
  turnaroundDays: z.number().int().positive().optional(),
});

export const upworkDeliveryTemplateInputSchema = z.object({
  clientName: z.string().optional(),
  contractId: z.string().optional(),
  archiveFileName: z.string().optional(),
  deliveryMode: upworkDeliveryModeSchema.default('UPWORK_ATTACHMENT'),
  includeExternalLink: z.boolean().default(false),
  externalLinkAllowed: z.boolean().default(false),
});

export const upworkRevisionUpdateSchema = z.object({
  contractId: z.string().trim().min(1),
  jobId: z.string().optional(),
  revisionStatus: upworkRevisionStatusSchema,
  revisionNotes: z.string().max(5000).optional(),
  requestedAt: z.string().datetime().optional(),
  dryRun: z.boolean().default(true),
});

export const upworkRetainerReminderInputSchema = z.object({
  clientName: z.string().optional(),
  contractTitle: z.string().optional(),
  monthlyImageEstimate: z.number().int().positive().optional(),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).optional(),
});

export const upworkSafetyCheckSchema = z.object({
  intendedActions: z.array(z.string()).default([]),
  deliveryMode: upworkDeliveryModeSchema.optional(),
  externalLinkAllowed: z.boolean().default(false),
});

export type UpworkManualContractInput = z.infer<typeof upworkManualContractInputSchema>;
export type UpworkOfferMappingInput = z.infer<typeof upworkOfferMappingSchema>;
export type UpworkProposalTemplateInput = z.infer<typeof upworkProposalTemplateInputSchema>;
export type UpworkDeliveryTemplateInput = z.infer<typeof upworkDeliveryTemplateInputSchema>;
export type UpworkRevisionUpdateInput = z.infer<typeof upworkRevisionUpdateSchema>;
export type UpworkRetainerReminderInput = z.infer<typeof upworkRetainerReminderInputSchema>;
