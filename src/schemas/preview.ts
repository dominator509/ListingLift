import { z } from 'zod';
import { PREVIEW_FILTER_STATUSES, PREVIEW_GALLERY_STATUSES, PREVIEW_ITEM_VISIBILITIES, PREVIEW_REVIEW_STATUSES } from '@/domain/preview-gallery';

export const previewGalleryStatusSchema = z.enum(PREVIEW_GALLERY_STATUSES);
export const previewItemVisibilitySchema = z.enum(PREVIEW_ITEM_VISIBILITIES);
export const previewReviewStatusSchema = z.enum(PREVIEW_REVIEW_STATUSES);
export const previewFilterStatusSchema = z.enum(PREVIEW_FILTER_STATUSES);

export const previewProcessedFileInputSchema = z.object({
  id: z.string().min(1),
  imageId: z.string().nullable().optional(),
  originalName: z.string().nullable().optional(),
  originalStorageKey: z.string().nullable().optional(),
  outputFileName: z.string().min(1),
  previewUrl: z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  storageKey: z.string().nullable().optional(),
  outputType: z.string().min(1),
  outputFormat: z.string().nullable().optional(),
  presetKey: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  qualityScore: z.number().int().min(0).max(100).nullable().optional(),
  status: z.string().min(1),
  approvedStatus: z.string().nullable().optional(),
  qualityFlags: z.array(z.string()).nullable().optional(),
  adminNotes: z.string().max(2000).nullable().optional(),
  clientNotes: z.string().max(2000).nullable().optional(),
});

export const previewFilterSchema = z.object({
  outputTypes: z.array(z.string()).default([]),
  presetKeys: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  reviewStatuses: z.array(previewFilterStatusSchema).default([]),
  approvedOnly: z.boolean().default(false),
  includeFlagged: z.boolean().default(true),
  includeFailed: z.boolean().default(true),
  search: z.string().max(120).optional(),
});

export const previewGalleryRequestSchema = z.object({
  organizationId: z.string().min(1).default('dry-run-org'),
  jobId: z.string().min(1),
  clientPreviewEnabled: z.boolean().default(false),
  filters: previewFilterSchema.default({
    outputTypes: [],
    presetKeys: [],
    platforms: [],
    reviewStatuses: [],
    approvedOnly: false,
    includeFlagged: true,
    includeFailed: true,
  }),
  processedFiles: z.array(previewProcessedFileInputSchema).default([]),
});

export const previewImageDetailRequestSchema = z.object({
  processedFileId: z.string().min(1),
  processedFiles: z.array(previewProcessedFileInputSchema).default([]),
});

export const bulkPreviewApprovalRequestSchema = z.object({
  jobId: z.string().min(1),
  selectedProcessedFileIds: z.array(z.string().min(1)).min(1),
  processedFiles: z.array(previewProcessedFileInputSchema).default([]),
  note: z.string().max(1000).optional(),
});

export type PreviewGalleryRequest = z.infer<typeof previewGalleryRequestSchema>;
export type BulkPreviewApprovalRequest = z.infer<typeof bulkPreviewApprovalRequestSchema>;
