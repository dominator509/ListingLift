import { prisma } from '@/lib/prisma';
import { randomBytes, randomUUID } from 'node:crypto';
import { hashToken } from '@/lib/tokens';
import { sanitizeUploadFileName, UPLOAD_INTAKE_LIMITS } from '@/domain/upload-intake';

function sanitizeDbFileName(fileName: string): string {
  // Strip path traversal, null bytes, and take only filename (not path)
  const noPath = fileName.replace(/\\/g, '/').split('/').filter(Boolean).pop() || 'upload';
  const noNull = noPath.replace(/\0/g, '');
  // Strip HTML/script injection
  const noHtml = noNull.replace(/<[^>]*>/g, '');
  // Remove control characters
  const cleaned = noHtml.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  // Limit length
  return cleaned.slice(0, UPLOAD_INTAKE_LIMITS.maxFileNameLength) || 'upload-file';
}

function normalizeFile(file: Record<string, unknown>): { fileName: string; mimeType: string; sizeBytes: number; width?: number; height?: number } {
  if (file.fileName) {
    return {
      fileName: sanitizeDbFileName(file.fileName as string),
      mimeType: String(file.mimeType ?? ''),
      sizeBytes: Number(file.sizeBytes) || 0,
      width: file.width as number | undefined,
      height: file.height as number | undefined,
    };
  }
  // Backward compat: accept old field names (name, type, size)
  return {
    fileName: sanitizeDbFileName((file.name ?? file.fileName ?? 'unknown') as string),
    mimeType: String(file.type ?? file.mimeType ?? 'application/octet-stream'),
    sizeBytes: Number(file.size ?? file.sizeBytes ?? 0) || 0,
    width: file.width as number | undefined,
    height: file.height as number | undefined,
  };
}

export function buildUploadIntakePlan(input: {
  organizationId: string;
  clientId?: string;
  jobId?: string;
  sourceKind?: string;
  source?: string;
  files?: Array<Record<string, unknown>>;
}) {
  const files = (input.files ?? []).map(normalizeFile);
  const uploadBatchId = randomUUID().slice(0, 12);
  const imageRecordDrafts = files.map((file) => ({
    storageKey: `/originals/${input.organizationId}/${input.jobId ?? '__new__'}/${uploadBatchId}/${randomUUID()}/${sanitizeUploadFileName(file.fileName)}`,
    originalFileName: file.fileName,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    width: file.width ?? null,
    height: file.height ?? null,
  }));

  return {
    imageRecordDrafts,
    storagePolicy: {
      preserveOriginals: true,
      finalDeliveryStillRequiresAdminApproval: true,
    },
    jobUpdateDraft: {
      uploadStatus: 'COMPLETE',
    },
    // Backward-compat fields for existing tests and callers
    phase: 'intake_planned',
    organizationId: input.organizationId,
    jobId: input.jobId ?? null,
    fileCount: files.length,
    totalSize: files.reduce((sum, f) => sum + f.sizeBytes, 0),
    source: input.source ?? input.sourceKind ?? 'direct_upload',
    note: 'Placeholder — actual intake processing not yet wired.',
  };
}

export function hashUploadToken(token: string): string {
  return hashToken(token);
}
