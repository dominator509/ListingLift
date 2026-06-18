import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS } from '@/domain/database-keys';

export const taskrabbitTaskCategorySchema = z.enum([
  'PRODUCT_PHOTO_CLEANUP',
  'MARKETPLACE_LISTING_HELP',
  'RESTAURANT_MENU_CLEANUP',
  'REAL_ESTATE_LISTING_VISUALS',
  'SMALL_BUSINESS_ECOMMERCE_SETUP',
  'LOCAL_SELLER_SUPPORT',
  'OTHER_LOCAL_SERVICE',
]);

export const taskrabbitWorkflowStatusSchema = z.enum([
  'DRAFT', 'TASK_CAPTURED', 'CUSTOMER_CONTACTED', 'FILES_NEEDED', 'FILES_RECEIVED', 'PROCESSING', 'WAITING_FOR_REVIEW', 'DELIVERY_READY', 'DELIVERED_IN_TASKRABBIT', 'REVISION_REQUESTED', 'DIRECT_FOLLOW_UP_PLANNED', 'DIRECT_RETAINER_CONVERTED', 'COMPLETED', 'CANCELLED', 'FAILED',
]);

export const taskrabbitDeliveryModeSchema = z.enum(['TASKRABBIT_MESSAGE', 'TASKRABBIT_MESSAGE_WITH_ALLOWED_LINK', 'MANUAL_EXTERNAL_DELIVERY_RECORDED']);
export const taskrabbitConversionStatusSchema = z.enum(['NOT_TRACKED', 'FOLLOW_UP_NEEDED', 'FOLLOW_UP_SENT', 'INTERESTED', 'CONVERTED_TO_DIRECT_CLIENT', 'DECLINED', 'DO_NOT_CONTACT']);
export const taskrabbitAppointmentStatusSchema = z.enum(['NOT_SCHEDULED', 'REQUESTED', 'SCHEDULED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);

const amountToCents = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Math.round(value * 100);
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : undefined;
});

export const taskrabbitManualTaskInputSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  taskId: z.string().trim().min(1),
  customerName: z.string().trim().min(1),
  businessName: z.string().trim().optional(),
  customerUsername: z.string().trim().optional(),
  taskTitle: z.string().trim().min(1),
  taskCategory: taskrabbitTaskCategorySchema.default('PRODUCT_PHOTO_CLEANUP'),
  appointmentStatus: taskrabbitAppointmentStatusSchema.default('SCHEDULED'),
  appointmentAt: z.string().datetime().optional(),
  deadline: z.string().datetime().optional(),
  taskValue: amountToCents,
  taskValueCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  cityOrArea: z.string().trim().max(120).optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  taskNotes: z.string().max(5000).optional(),
  packagePurchased: z.string().trim().optional(),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).optional(),
  serviceAngleKey: z.string().trim().optional(),
  revisionAllowance: z.number().int().nonnegative().optional(),
  conversionStatus: taskrabbitConversionStatusSchema.default('FOLLOW_UP_NEEDED'),
  followUpOpportunity: z.string().max(2000).optional(),
  externalLinkAllowed: z.boolean().default(false),
  uploadStatus: z.enum(['NOT_STARTED', 'WAITING_FOR_UPLOAD', 'RECEIVED', 'PARTIAL', 'FAILED']).default('WAITING_FOR_UPLOAD'),
  dryRun: z.boolean().default(true),
});

export const taskrabbitServiceMappingSchema = z.object({
  key: z.string().trim().min(1),
  category: taskrabbitTaskCategorySchema,
  title: z.string().trim().min(1),
  searchHints: z.array(z.string()).default([]),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS),
  imageAllowance: z.number().int().nonnegative(),
  revisionAllowance: z.number().int().nonnegative(),
  defaultTurnaroundDays: z.number().int().positive(),
  defaultDeliveryMode: taskrabbitDeliveryModeSchema,
  createsUploadLink: z.boolean().default(true),
  conversionFollowUpRecommended: z.boolean().default(false),
  active: z.boolean().default(true),
  safeDescription: z.string().trim().min(1),
});

export const taskrabbitDeliveryMessageInputSchema = z.object({
  customerName: z.string().optional(),
  taskId: z.string().optional(),
  archiveFileName: z.string().optional(),
  includeExternalLink: z.boolean().default(false),
  externalLinkAllowed: z.boolean().default(false),
});

export const taskrabbitConversionUpdateSchema = z.object({
  taskId: z.string().trim().min(1),
  jobId: z.string().optional(),
  conversionStatus: taskrabbitConversionStatusSchema,
  followUpNotes: z.string().max(5000).optional(),
  monthlyImageEstimate: z.number().int().positive().optional(),
  dryRun: z.boolean().default(true),
});

export const taskrabbitFollowUpPromptInputSchema = z.object({
  customerName: z.string().optional(),
  businessName: z.string().optional(),
  monthlyImageEstimate: z.number().int().positive().optional(),
  serviceAngle: z.string().optional(),
});

export const taskrabbitSafetyCheckSchema = z.object({
  intendedActions: z.array(z.string()).default([]),
  deliveryMode: taskrabbitDeliveryModeSchema.optional(),
  externalLinkAllowed: z.boolean().default(false),
  storesLocationData: z.boolean().default(false),
  customerConsentForDirectFollowUp: z.boolean().default(false),
});

export type TaskrabbitManualTaskInput = z.infer<typeof taskrabbitManualTaskInputSchema>;
export type TaskrabbitServiceMappingInput = z.infer<typeof taskrabbitServiceMappingSchema>;
export type TaskrabbitDeliveryMessageInput = z.infer<typeof taskrabbitDeliveryMessageInputSchema>;
export type TaskrabbitConversionUpdateInput = z.infer<typeof taskrabbitConversionUpdateSchema>;
export type TaskrabbitFollowUpPromptInput = z.infer<typeof taskrabbitFollowUpPromptInputSchema>;
