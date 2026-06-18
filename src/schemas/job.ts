import { z } from 'zod';
import { JOB_STATUSES } from '@/domain/job-status';
import { DEADLINE_WARNING_LEVELS, JOB_PRIORITIES, JOB_QUEUE_SORT_FIELDS } from '@/domain/job-queue';

export const jobStatusSchema = z.enum(JOB_STATUSES);
export const jobPrioritySchema = z.enum(JOB_PRIORITIES);
export const deadlineWarningLevelSchema = z.enum(DEADLINE_WARNING_LEVELS);

export const intakeSchema = z.object({
  clientName: z.string().min(1),
  businessName: z.string().optional(),
  targetPlatform: z.string().min(1),
  salesChannelSource: z.string().min(1),
  productCategory: z.string().optional(),
  imageQuantity: z.number().int().positive(),
  backgroundPreference: z.string().optional(),
  outputSize: z.string().optional(),
  fileFormat: z.string().optional(),
  brandColors: z.string().optional(),
  skuNamingPreference: z.string().optional(),
  revisionNotes: z.string().optional(),
  deadline: z.string().datetime().optional(),
  orderSource: z.string().optional(),
  externalOrderId: z.string().optional(),
  packagePurchased: z.string().min(1),
});

export const adminJobQueueFilterSchema = z.object({
  organizationId: z.string().optional(),
  status: z.array(jobStatusSchema).optional(),
  sourceChannelName: z.array(z.string().min(1)).optional(),
  priority: z.array(jobPrioritySchema).optional(),
  clientId: z.string().optional(),
  packageKey: z.string().optional(),
  paymentStatus: z.string().optional(),
  uploadStatus: z.string().optional(),
  fulfillmentStatus: z.string().optional(),
  deadlineFrom: z.string().datetime().optional(),
  deadlineTo: z.string().datetime().optional(),
  deadlineWarningLevel: z.array(deadlineWarningLevelSchema).optional(),
  search: z.string().max(200).optional(),
  sortBy: z.enum(JOB_QUEUE_SORT_FIELDS).default('deadline'),
  sortDirection: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(25),
});

export const manualJobCreateSchema = z.object({
  organizationId: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().min(1).max(160),
  businessName: z.string().max(160).optional(),
  title: z.string().min(1).max(180),
  packageKey: z.string().min(1),
  targetPlatform: z.string().min(1).max(80),
  selectedPresetKeys: z.array(z.string().min(1)).default([]),
  sourceChannelName: z.string().min(1).max(80).default('manual'),
  externalOrderId: z.string().max(160).optional(),
  sourceUrl: z.string().url().optional(),
  imageQuantity: z.number().int().positive().max(10000),
  orderAmount: z.number().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  paymentStatus: z.string().default('PENDING'),
  deadline: z.string().datetime().optional(),
  priority: jobPrioritySchema.default('NORMAL'),
  backgroundPreference: z.string().max(120).optional(),
  outputSize: z.string().max(120).optional(),
  fileFormat: z.string().max(80).optional(),
  brandColors: z.string().max(500).optional(),
  skuNamingPreference: z.string().max(500).optional(),
  revisionNotes: z.string().max(2000).optional(),
  adminNotes: z.string().max(5000).optional(),
  clientIntakeNotes: z.string().max(5000).optional(),
});

export const jobStatusTransitionSchema = z.object({
  nextStatus: jobStatusSchema,
  note: z.string().max(1000).optional(),
  reason: z.string().max(500).optional(),
  manualOverride: z.boolean().default(false),
});

export const jobAdminNoteSchema = z.object({
  note: z.string().min(1).max(5000),
  visibility: z.enum(['INTERNAL', 'CLIENT_VISIBLE']).default('INTERNAL'),
});

export const jobDeadlineUpdateSchema = z.object({
  deadline: z.string().datetime().nullable(),
  reason: z.string().max(500).optional(),
  priority: jobPrioritySchema.optional(),
});

export const jobQueueItemSchema = z.object({
  id: z.string(),
  jobNumber: z.string().nullable().optional(),
  title: z.string(),
  clientName: z.string().nullable().optional(),
  packageKey: z.string().nullable().optional(),
  sourceChannelName: z.string().nullable().optional(),
  status: jobStatusSchema,
  priority: jobPrioritySchema.default('NORMAL'),
  deadline: z.string().datetime().nullable().optional(),
  deadlineWarningLevel: deadlineWarningLevelSchema.default('NONE'),
  imageQuantity: z.number().int().nonnegative().default(0),
  paymentStatus: z.string().optional(),
  uploadStatus: z.string().optional(),
  fulfillmentStatus: z.string().optional(),
  revenueAttribution: z.unknown().optional(),
  queueRank: z.number().optional(),
});

export type IntakeInput = z.infer<typeof intakeSchema>;
export type AdminJobQueueFilter = z.infer<typeof adminJobQueueFilterSchema>;
export type ManualJobCreateInput = z.infer<typeof manualJobCreateSchema>;
export type JobStatusTransitionInput = z.infer<typeof jobStatusTransitionSchema>;
export type JobAdminNoteInput = z.infer<typeof jobAdminNoteSchema>;
export type JobDeadlineUpdateInput = z.infer<typeof jobDeadlineUpdateSchema>;
export type JobQueueItem = z.infer<typeof jobQueueItemSchema>;
