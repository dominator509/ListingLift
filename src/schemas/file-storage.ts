import { z } from 'zod';

export const fileStorageProviderKeySchema = z.enum(['local', 'mock', 'google_drive', 'dropbox', 'onedrive_later', 'box_later']);
export const fileStorageObjectKindSchema = z.enum(['ORIGINAL_UPLOAD','PROCESSED_OUTPUT','PREVIEW_IMAGE','DELIVERY_ARCHIVE','MANIFEST','README','MANUAL_REPLACEMENT','REPORT','TEMPORARY_EXPORT']);
export const fileStorageOperationSchema = z.enum(['UPLOAD','DOWNLOAD','COPY','MOVE','DELETE','LIST','SYNC_IN','SYNC_OUT','HEALTH_CHECK','CREATE_FOLDER']);

export const fileStorageConnectionCreateSchema = z.object({
  providerKey: fileStorageProviderKeySchema,
  displayName: z.string().min(2).max(120),
  rootFolderId: z.string().max(512).optional(),
  rootFolderPath: z.string().max(1024).optional(),
  encryptedSecretId: z.string().uuid().optional(),
  config: z.record(z.string(), z.unknown()).default({}),
});

export const fileStorageConnectionUpdateSchema = fileStorageConnectionCreateSchema.partial().extend({
  connectionId: z.string().uuid(),
  status: z.enum(['DISABLED','MOCK_ENABLED','CONFIGURED','NEEDS_AUTH','HEALTHY','DEGRADED','FAILED','REVOKED']).optional(),
});

export const fileStorageAccessPlanSchema = z.object({
  providerKey: fileStorageProviderKeySchema,
  objectKind: fileStorageObjectKindSchema,
  organizationId: z.string().min(1),
  clientId: z.string().optional(),
  jobId: z.string().optional(),
  storageKey: z.string().min(1).max(2048),
  expiresInSeconds: z.number().int().min(60).max(86400).default(900),
  purpose: z.string().max(160).default('ListingLift file access'),
});

export const fileStorageFolderImportSchema = z.object({
  providerKey: fileStorageProviderKeySchema,
  connectionId: z.string().uuid().optional(),
  sourceFolderId: z.string().max(512).optional(),
  sourceFolderUrl: z.string().url().optional(),
  jobId: z.string().min(1),
  expectedClientId: z.string().optional(),
  expectedFileCount: z.number().int().min(1).max(10000).optional(),
  dryRun: z.boolean().default(true),
}).refine((value) => value.sourceFolderId || value.sourceFolderUrl, 'sourceFolderId or sourceFolderUrl is required');

export const fileStorageExportPlanSchema = z.object({
  providerKey: fileStorageProviderKeySchema,
  connectionId: z.string().uuid().optional(),
  jobId: z.string().min(1),
  deliveryArchiveId: z.string().optional(),
  destinationFolderId: z.string().max(512).optional(),
  destinationFolderPath: z.string().max(1024).optional(),
  dryRun: z.boolean().default(true),
});

export type FileStorageConnectionCreateInput = z.infer<typeof fileStorageConnectionCreateSchema>;
export type FileStorageConnectionUpdateInput = z.infer<typeof fileStorageConnectionUpdateSchema>;
export type FileStorageAccessPlanInput = z.infer<typeof fileStorageAccessPlanSchema>;
export type FileStorageFolderImportInput = z.infer<typeof fileStorageFolderImportSchema>;
export type FileStorageExportPlanInput = z.infer<typeof fileStorageExportPlanSchema>;
