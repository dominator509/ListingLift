import { buildUploadBatchPrefix, sanitizeUploadFileName } from '@/domain/upload-intake';

export function assertStorageKeySafe(storageKey: string) {
  if (storageKey.includes('..') || storageKey.startsWith('/') || storageKey.includes('\\')) {
    throw new Error('Unsafe storage key generated.');
  }
  return storageKey;
}

export function buildOriginalStorageKey(input: { organizationId: string; jobId?: string | null; uploadBatchId: string; fileName: string }) {
  const prefix = buildUploadBatchPrefix(input);
  return assertStorageKeySafe(`${prefix}/${sanitizeUploadFileName(input.fileName)}`);
}

export function buildExtractedZipStorageKey(input: { organizationId: string; jobId?: string | null; uploadBatchId: string; zipRootPath: string; fileName: string }) {
  const prefix = buildUploadBatchPrefix(input);
  const safeRoot = input.zipRootPath.split('/').map(sanitizeUploadFileName).filter(Boolean).join('/');
  const root = safeRoot ? `${safeRoot}/` : '';
  return assertStorageKeySafe(`${prefix}/zip-extracted/${root}${sanitizeUploadFileName(input.fileName)}`);
}
