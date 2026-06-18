export const DIRECT_UPLOAD_PHASE = 8 as const;

export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const;
export const ALLOWED_ARCHIVE_MIME_TYPES = ['application/zip', 'application/x-zip-compressed'] as const;
export const ALLOWED_UPLOAD_MIME_TYPES = [...ALLOWED_IMAGE_MIME_TYPES, ...ALLOWED_ARCHIVE_MIME_TYPES] as const;

export const IMAGE_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'] as const;
export const ARCHIVE_FILE_EXTENSIONS = ['.zip'] as const;
export const UNSAFE_FILE_EXTENSIONS = [
  '.app', '.bat', '.bin', '.cmd', '.com', '.cpl', '.dll', '.dmg', '.exe', '.gadget', '.hta', '.jar', '.js', '.jse', '.lnk', '.msi', '.msp', '.pif', '.ps1', '.scr', '.sh', '.vb', '.vbe', '.vbs', '.ws', '.wsf', '.wsh', '.php', '.py', '.rb', '.pl', '.cgi', '.html', '.htm', '.svg'
] as const;

export const UPLOAD_INTAKE_LIMITS = {
  maxSingleImageBytes: 50 * 1024 * 1024,
  maxArchiveBytes: 1024 * 1024 * 1024,
  maxFilesPerBatch: 250,
  maxFileNameLength: 180,
  uploadTokenTtlMinutes: 60 * 24 * 7,
  maxZipEntries: 500,
  maxZipDepth: 8,
} as const;

export const UPLOAD_BATCH_STATUSES = ['PLANNED', 'VALIDATING', 'REJECTED', 'ACCEPTED', 'PARTIAL', 'COMPLETE', 'FAILED'] as const;
export const UPLOAD_SOURCE_KINDS = ['DIRECT_UPLOAD', 'ADMIN_UPLOAD', 'ZIP_UPLOAD', 'DRIVE_IMPORT', 'DROPBOX_IMPORT', 'SHOPIFY_EXPORT', 'MANUAL_REPLACEMENT'] as const;
export const UPLOAD_EVENT_TYPES = ['TOKEN_ISSUED', 'TOKEN_RESOLVED', 'FILE_VALIDATED', 'FILE_REJECTED', 'ZIP_INSPECTED', 'BATCH_ACCEPTED', 'BATCH_PARTIAL', 'BATCH_FAILED', 'ADMIN_UPLOAD_MARKED'] as const;

export type UploadSourceKind = (typeof UPLOAD_SOURCE_KINDS)[number];
export type UploadBatchStatus = (typeof UPLOAD_BATCH_STATUSES)[number];
export type UploadEventType = (typeof UPLOAD_EVENT_TYPES)[number];

export function getFileExtension(fileName: string): string {
  const clean = fileName.trim().toLowerCase();
  const index = clean.lastIndexOf('.');
  return index >= 0 ? clean.slice(index) : '';
}

export function isAllowedImageMimeType(mimeType: string): boolean {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function isAllowedArchiveMimeType(mimeType: string): boolean {
  return (ALLOWED_ARCHIVE_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function isAllowedUploadMimeType(mimeType: string): boolean {
  return (ALLOWED_UPLOAD_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function isUnsafeFileName(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  if ((UNSAFE_FILE_EXTENSIONS as readonly string[]).includes(extension)) return true;
  if (fileName.includes('\0')) return true;
  if (/\.\./.test(fileName.replace(/\\/g, '/'))) return true;
  return false;
}

export function sanitizeUploadFileName(fileName: string): string {
  const trimmed = fileName.trim().replace(/\\/g, '/').split('/').filter(Boolean).pop() || 'upload';
  const withoutControls = trimmed.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  const normalized = withoutControls.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-]+(?=\.)|[-]+$/g, '');
  const limited = normalized.slice(0, UPLOAD_INTAKE_LIMITS.maxFileNameLength);
  return limited || 'upload-file';
}

export function classifyUploadFile(fileName: string, mimeType: string): UploadSourceKind | 'DIRECT_IMAGE' | 'ARCHIVE' | 'UNSUPPORTED' {
  const extension = getFileExtension(fileName);
  if (isAllowedArchiveMimeType(mimeType) || (ARCHIVE_FILE_EXTENSIONS as readonly string[]).includes(extension)) return 'ARCHIVE';
  if (isAllowedImageMimeType(mimeType) || (IMAGE_FILE_EXTENSIONS as readonly string[]).includes(extension)) return 'DIRECT_IMAGE';
  return 'UNSUPPORTED';
}

export function buildUploadBatchPrefix(input: { organizationId: string; jobId?: string | null; uploadBatchId: string }): string {
  const jobSegment = input.jobId ? `jobs/${input.jobId}` : 'unassigned-jobs';
  return `org/${input.organizationId}/${jobSegment}/originals/${input.uploadBatchId}`;
}

export function isComplianceSafeUploadCopy(text: string): boolean {
  const lower = text.toLowerCase();
  return !/(guarantee|guaranteed|approved by amazon|amazon compliant|etsy compliant|rank higher|conversion increase|sales increase)/.test(lower);
}
