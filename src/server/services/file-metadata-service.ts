import { sha256 } from '@/lib/hash';
import type { UploadFileMetadata } from '@/schemas/upload';
import { getFileExtension, sanitizeUploadFileName } from '@/domain/upload-intake';

export function hashUploadBuffer(buffer: Buffer) {
  return sha256(buffer);
}

export function buildFileMetadataPlan(file: UploadFileMetadata) {
  return {
    originalName: file.fileName,
    safeName: sanitizeUploadFileName(file.fileName),
    extension: getFileExtension(file.fileName),
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    sha256: file.sha256,
    dimensions: file.width && file.height ? { width: file.width, height: file.height } : null,
    metadataExtractionRequired: !file.width || !file.height,
  };
}

export function buildOriginalImageRecordDraft(input: { organizationId: string; clientId?: string | null; jobId: string; storageKey: string; file: UploadFileMetadata; uploadBatchId?: string }) {
  const metadata = buildFileMetadataPlan(input.file);
  return {
    organizationId: input.organizationId,
    clientId: input.clientId ?? undefined,
    jobId: input.jobId,
    uploadBatchId: input.uploadBatchId,
    originalName: input.file.fileName,
    storageKey: input.storageKey,
    mimeType: input.file.mimeType,
    sizeBytes: input.file.sizeBytes,
    width: input.file.width,
    height: input.file.height,
    sha256: input.file.sha256,
    fileExtension: metadata.extension,
    originalRelativePath: input.file.relativePath,
    metadata,
  };
}
