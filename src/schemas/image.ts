import { z } from 'zod';

export const imageMetadataSchema = z.object({
  originalName: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  sha256: z.string().optional(),
});

export const processedFileSchema = z.object({
  jobId: z.string().min(1),
  imageId: z.string().optional(),
  presetKey: z.string().optional(),
  outputKind: z.string().min(1),
  fileName: z.string().min(1),
  folderPath: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  sizeBytes: z.number().int().positive().optional(),
  status: z.string().default('created'),
});

export type ImageMetadataInput = z.infer<typeof imageMetadataSchema>;
export type ProcessedFileInput = z.infer<typeof processedFileSchema>;
