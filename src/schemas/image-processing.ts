import { z } from 'zod';
import { IMAGE_PROVIDER_KEYS, IMAGE_PROVIDER_OPERATIONS } from '@/domain/image-providers';
import { PROCESSING_RUN_STATUSES, PROCESSING_STEP_STATUSES, CORE_PROCESSING_OPERATIONS } from '@/domain/image-processing';

export const processingRunStatusSchema = z.enum(PROCESSING_RUN_STATUSES);
export const processingStepStatusSchema = z.enum(PROCESSING_STEP_STATUSES);
export const coreProcessingOperationSchema = z.enum(CORE_PROCESSING_OPERATIONS);

export const processingImageInputSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  jobId: z.string().min(1),
  originalName: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  status: z.string().optional(),
});

export const processingJobInputSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  jobNumber: z.string().nullable().optional(),
  selectedPresetKeys: z.array(z.string().min(1)).nullable().optional(),
  backgroundPreference: z.string().nullable().optional(),
  fileFormat: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

export const processingOutputDraftSchema = z.object({
  imageId: z.string().min(1),
  sourceStorageKey: z.string().min(1),
  presetKey: z.string().nullable().optional(),
  outputType: z.string().min(1),
  outputFormat: z.string().min(1),
  backgroundType: z.string().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  folderPath: z.string().min(1),
  fileName: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1),
  operations: z.array(z.enum(IMAGE_PROVIDER_OPERATIONS)),
  sellerReviewRequired: z.boolean(),
  manualFallbackAllowed: z.boolean(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const processingRunPlanRequestSchema = z.object({
  job: processingJobInputSchema,
  images: z.array(processingImageInputSchema).min(1),
  presetKeys: z.array(z.string().min(1)).optional(),
  providerKey: z.enum(IMAGE_PROVIDER_KEYS).default('mock-image-provider'),
  dryRun: z.boolean().default(true),
});

export const processingQueueRequestSchema = z.object({
  jobId: z.string().min(1),
  providerKey: z.enum(IMAGE_PROVIDER_KEYS).default('mock-image-provider'),
  presetKeys: z.array(z.string().min(1)).optional(),
  dryRun: z.boolean().default(true),
});

export const processSingleImageRequestSchema = z.object({
  organizationId: z.string().min(1),
  jobId: z.string().min(1),
  image: processingImageInputSchema,
  presetKeys: z.array(z.string().min(1)).optional(),
  providerKey: z.enum(IMAGE_PROVIDER_KEYS).default('mock-image-provider'),
  dryRun: z.boolean().default(true),
});

export const processingRunDraftSchema = z.object({
  organizationId: z.string().min(1),
  jobId: z.string().min(1),
  providerKey: z.string().min(1),
  status: processingRunStatusSchema,
  imageCount: z.number().int().nonnegative(),
  outputCount: z.number().int().nonnegative(),
  selectedPresetKeys: z.array(z.string()),
  operations: z.array(coreProcessingOperationSchema),
  manualFallbackRequired: z.boolean(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const processingStepDraftSchema = z.object({
  organizationId: z.string().min(1),
  jobId: z.string().min(1),
  imageId: z.string().min(1),
  providerKey: z.string().min(1),
  operation: coreProcessingOperationSchema,
  status: processingStepStatusSchema,
  inputStorageKey: z.string().min(1),
  outputStorageKey: z.string().nullable().optional(),
  presetKey: z.string().nullable().optional(),
  outputType: z.string().nullable().optional(),
  outputFormat: z.string().nullable().optional(),
  backgroundType: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const processingErrorDraftSchema = z.object({
  organizationId: z.string().min(1),
  jobId: z.string().min(1),
  imageId: z.string().nullable().optional(),
  providerKey: z.string().nullable().optional(),
  code: z.string().min(1),
  message: z.string().min(1),
  retryable: z.boolean(),
  manualFallbackRequired: z.boolean(),
  safeDetails: z.record(z.string(), z.unknown()).default({}),
});

export type ProcessingRunPlanRequest = z.infer<typeof processingRunPlanRequestSchema>;
export type ProcessingQueueRequest = z.infer<typeof processingQueueRequestSchema>;
export type ProcessSingleImageRequest = z.infer<typeof processSingleImageRequestSchema>;
