import {
  ALLOWED_UPLOAD_MIME_TYPES,
  UPLOAD_INTAKE_LIMITS,
  classifyUploadFile,
  getFileExtension,
  isAllowedArchiveMimeType,
  isAllowedImageMimeType,
  isUnsafeFileName,
  sanitizeUploadFileName,
} from '@/domain/upload-intake';
import type { UploadFileMetadata } from '@/schemas/upload';

export type UploadValidationIssue = {
  code: string;
  severity: 'error' | 'warning';
  fileName?: string;
  message: string;
};

export type UploadValidationOptions = {
  maxFiles?: number;
  maxBytesPerFile?: number;
  packageImageAllowance?: number;
  allowedMimeTypes?: readonly string[];
};

export function validateSingleUploadFile(file: UploadFileMetadata, options: UploadValidationOptions = {}) {
  const issues: UploadValidationIssue[] = [];
  const allowedMimeTypes = options.allowedMimeTypes ?? ALLOWED_UPLOAD_MIME_TYPES;
  const sanitizedFileName = sanitizeUploadFileName(file.fileName);
  const extension = getFileExtension(file.fileName);
  const uploadKind = classifyUploadFile(file.fileName, file.mimeType);
  const maxBytes = isAllowedArchiveMimeType(file.mimeType)
    ? UPLOAD_INTAKE_LIMITS.maxArchiveBytes
    : options.maxBytesPerFile ?? UPLOAD_INTAKE_LIMITS.maxSingleImageBytes;

  if (sanitizedFileName !== file.fileName) {
    issues.push({ code: 'filename_sanitized', severity: 'warning', fileName: file.fileName, message: `File name will be stored as ${sanitizedFileName}.` });
  }
  if (isUnsafeFileName(file.fileName)) {
    issues.push({ code: 'unsafe_filename', severity: 'error', fileName: file.fileName, message: 'Executables, scripts, traversal paths, and unsafe names are rejected.' });
  }
  if (!allowedMimeTypes.includes(file.mimeType)) {
    issues.push({ code: 'unsupported_mime_type', severity: 'error', fileName: file.fileName, message: `${file.mimeType} is not an allowed upload type.` });
  }
  if (uploadKind === 'UNSUPPORTED') {
    issues.push({ code: 'unsupported_file_extension', severity: 'error', fileName: file.fileName, message: `${extension || 'missing extension'} is not supported.` });
  }
  if (file.sizeBytes > maxBytes) {
    issues.push({ code: 'file_too_large', severity: 'error', fileName: file.fileName, message: `File exceeds the configured ${maxBytes} byte limit.` });
  }
  if (isAllowedImageMimeType(file.mimeType) && (!file.width || !file.height)) {
    issues.push({ code: 'metadata_pending', severity: 'warning', fileName: file.fileName, message: 'Image dimensions should be extracted by the runtime image metadata worker.' });
  }
  if (isAllowedArchiveMimeType(file.mimeType) && file.sizeBytes > UPLOAD_INTAKE_LIMITS.maxArchiveBytes) {
    issues.push({ code: 'archive_too_large', severity: 'error', fileName: file.fileName, message: 'ZIP archive exceeds the configured archive limit.' });
  }

  return {
    accepted: !issues.some((issue) => issue.severity === 'error'),
    sanitizedFileName,
    uploadKind,
    issues,
  };
}

export function validateUploadBatch(files: UploadFileMetadata[], options: UploadValidationOptions = {}) {
  const issues: UploadValidationIssue[] = [];
  const maxFiles = options.maxFiles ?? UPLOAD_INTAKE_LIMITS.maxFilesPerBatch;
  if (files.length > maxFiles) {
    issues.push({ code: 'too_many_files', severity: 'error', message: `Upload has ${files.length} files; limit is ${maxFiles}.` });
  }

  const seen = new Set<string>();
  const fileResults = files.map((file) => {
    const result = validateSingleUploadFile(file, options);
    const fingerprint = file.sha256 ? `sha:${file.sha256}` : `name:${file.fileName.toLowerCase()}:${file.sizeBytes}`;
    if (seen.has(fingerprint)) {
      result.issues.push({ code: 'duplicate_file', severity: 'warning', fileName: file.fileName, message: 'Possible duplicate file in same upload batch.' });
    }
    seen.add(fingerprint);
    return { file, ...result };
  });

  const acceptedImageCount = fileResults.filter((entry) => entry.accepted && entry.uploadKind === 'DIRECT_IMAGE').length;
  if (options.packageImageAllowance && acceptedImageCount > options.packageImageAllowance) {
    issues.push({ code: 'package_allowance_exceeded', severity: 'error', message: `Accepted image count ${acceptedImageCount} exceeds package allowance ${options.packageImageAllowance}.` });
  }

  const acceptedCount = fileResults.filter((entry) => entry.accepted).length;
  const rejectedCount = fileResults.length - acceptedCount;
  return {
    accepted: !issues.some((issue) => issue.severity === 'error') && acceptedCount > 0,
    status: rejectedCount === 0 && issues.every((issue) => issue.severity !== 'error') ? 'ACCEPTED' : acceptedCount > 0 ? 'PARTIAL' : 'REJECTED',
    acceptedCount,
    rejectedCount,
    totalBytes: files.reduce((sum, file) => sum + file.sizeBytes, 0),
    issues,
    fileResults,
  };
}
