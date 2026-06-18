import { z } from 'zod';
import { QUALITY_FLAG_KEYS, QUALITY_FLAG_SEVERITIES, QUALITY_FLAG_STATUSES, QUALITY_REVIEW_STATUSES } from '@/domain/quality-control';

export const qualityFlagKeySchema = z.enum(QUALITY_FLAG_KEYS);
export const qualityFlagSeveritySchema = z.enum(QUALITY_FLAG_SEVERITIES);
export const qualityFlagStatusSchema = z.enum(QUALITY_FLAG_STATUSES);
export const qualityReviewStatusSchema = z.enum(QUALITY_REVIEW_STATUSES);

export const qualityOutputSchema = z.object({
  id: z.string().min(1),
  outputFileName: z.string().min(1),
  outputType: z.string().optional().nullable(),
  presetKey: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  qualityScore: z.number().int().min(0).max(100).optional().nullable(),
  status: z.string().optional().nullable(),
  approvedStatus: z.string().optional().nullable(),
  flags: z.array(z.string()).default([]),
  adminNotes: z.string().max(2000).optional().nullable(),
});

export const qualityReviewRequestSchema = z.object({
  organizationId: z.string().min(1).optional(),
  jobId: z.string().min(1),
  processedFileId: z.string().min(1).optional(),
  output: qualityOutputSchema.optional(),
  outputs: z.array(qualityOutputSchema).default([]),
});

export const createQualityFlagSchema = z.object({
  processedFileId: z.string().min(1),
  imageId: z.string().optional().nullable(),
  previewGalleryItemId: z.string().optional().nullable(),
  flagKey: z.string().min(1),
  severity: qualityFlagSeveritySchema.optional(),
  message: z.string().min(1).max(2000),
  suggestedAction: z.string().max(2000).optional().nullable(),
  adminNotes: z.string().max(2000).optional().nullable(),
  clientVisible: z.boolean().default(false),
});

export const resolveQualityFlagSchema = z.object({
  flagId: z.string().min(1),
  resolution: z.string().min(1).max(2000),
  status: z.enum(['RESOLVED', 'DISMISSED']),
  manualReplacementUploaded: z.boolean().default(false),
});

export const qualityReviewDecisionSchema = z.object({
  processedFileId: z.string().min(1),
  decision: z.enum(['PASS', 'FLAG', 'FAIL', 'NEEDS_MANUAL_REPLACEMENT', 'RESOLVE']),
  flagKeys: z.array(z.string()).default([]),
  qualityScore: z.number().int().min(0).max(100).optional(),
  adminNotes: z.string().max(2000).optional().nullable(),
  clientVisibleNotes: z.string().max(1000).optional().nullable(),
  blockFinalDelivery: z.boolean().default(true),
});

export const bulkQualityReviewSchema = z.object({
  jobId: z.string().min(1),
  processedFileIds: z.array(z.string().min(1)).min(1),
  decision: z.enum(['PASS_READY_OUTPUTS', 'ACKNOWLEDGE_FLAGS', 'REQUEST_REPROCESS', 'MARK_MANUAL_REPLACEMENT_REQUIRED']),
  notes: z.string().max(2000).optional().nullable(),
});

export type QualityReviewRequest = z.infer<typeof qualityReviewRequestSchema>;
export type QualityOutput = z.infer<typeof qualityOutputSchema>;
export type CreateQualityFlagInput = z.infer<typeof createQualityFlagSchema>;
export type ResolveQualityFlagInput = z.infer<typeof resolveQualityFlagSchema>;
export type QualityReviewDecisionInput = z.infer<typeof qualityReviewDecisionSchema>;
export type BulkQualityReviewInput = z.infer<typeof bulkQualityReviewSchema>;
