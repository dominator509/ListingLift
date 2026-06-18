import { z } from 'zod';
import { DELIVERY_ARCHIVE_FILE_KINDS, DELIVERY_ARCHIVE_STATUSES, MANIFEST_STATUSES } from '@/domain/delivery-packaging';

export const deliveryProcessedFileInputSchema = z.object({
  id: z.string().min(1),
  imageId: z.string().nullable().optional(),
  sourceImageName: z.string().nullable().optional(),
  presetKey: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  outputType: z.string().min(1),
  outputFormat: z.string().min(1),
  backgroundType: z.string().nullable().optional(),
  fileName: z.string().min(1),
  folderPath: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  sizeBytes: z.number().int().nonnegative().nullable().optional(),
  status: z.string().nullable().optional(),
  approvedStatus: z.string().nullable().optional(),
  sellerReviewRequired: z.boolean().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const deliveryArchivePlanRequestSchema = z.object({
  organizationId: z.string().min(1),
  jobId: z.string().min(1),
  jobNumber: z.string().nullable().optional(),
  clientName: z.string().min(1),
  selectedPresetKeys: z.array(z.string().min(1)).default([]),
  includeBeforeAfter: z.boolean().default(true),
  includeReadme: z.boolean().default(true),
  includeManifest: z.boolean().default(true),
  processedFiles: z.array(deliveryProcessedFileInputSchema).default([]),
});

export const deliveryArchiveFilePlanSchema = z.object({
  kind: z.enum(DELIVERY_ARCHIVE_FILE_KINDS),
  processedFileId: z.string().nullable().optional(),
  sourceImageId: z.string().nullable().optional(),
  sourceImageName: z.string().nullable().optional(),
  presetKey: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  folderPath: z.string().min(1),
  fileName: z.string().min(1),
  archivePath: z.string().min(1),
  storageKey: z.string().nullable().optional(),
  mimeType: z.string().min(1),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  sizeBytes: z.number().int().nonnegative().nullable().optional(),
  format: z.string().min(1),
  outputType: z.string().nullable().optional(),
  backgroundType: z.string().nullable().optional(),
  status: z.enum(MANIFEST_STATUSES),
  sellerReviewRequired: z.boolean(),
  notes: z.string().nullable().optional(),
});

export const deliveryArchivePlanSchema = z.object({
  organizationId: z.string().min(1),
  jobId: z.string().min(1),
  jobNumber: z.string().nullable().optional(),
  clientName: z.string().min(1),
  rootFolder: z.string().min(1),
  status: z.enum(DELIVERY_ARCHIVE_STATUSES),
  files: z.array(deliveryArchiveFilePlanSchema),
  folders: z.array(z.string().min(1)),
  manifestCsv: z.string(),
  readmeText: z.string(),
  zipFileName: z.string().min(1),
  zipStorageKey: z.string().min(1),
  fileCount: z.number().int().nonnegative(),
  outputCount: z.number().int().nonnegative(),
  missingCount: z.number().int().nonnegative(),
  sellerReviewRequired: z.boolean(),
  metadata: z.record(z.string(), z.unknown()),
});

export const deliveryZipDraftRequestSchema = z.object({
  jobId: z.string().min(1),
  approvedOnly: z.boolean().default(true),
  dryRun: z.boolean().default(true),
});

export type DeliveryArchivePlanRequestInput = z.infer<typeof deliveryArchivePlanRequestSchema>;
export type DeliveryZipDraftRequestInput = z.infer<typeof deliveryZipDraftRequestSchema>;
