import { ARCHIVE_FILE_EXTENSIONS, getFileExtension, IMAGE_FILE_EXTENSIONS, isUnsafeFileName, sanitizeUploadFileName, UPLOAD_INTAKE_LIMITS } from '@/domain/upload-intake';
import type { ZipEntryMetadata } from '@/schemas/upload';

export type ZipEntryIssue = {
  code: string;
  severity: 'error' | 'warning';
  path: string;
  message: string;
};

export function normalizeZipEntryPath(path: string) {
  return path.replace(/\\/g, '/').split('/').filter(Boolean).join('/');
}

export function isZipSlipPath(path: string) {
  const normalized = path.replace(/\\/g, '/');
  if (normalized.startsWith('/') || /^[a-zA-Z]:\//.test(normalized)) return true;
  return normalized.split('/').some((part) => part === '..');
}

export function validateZipEntry(entry: ZipEntryMetadata) {
  const issues: ZipEntryIssue[] = [];
  const normalizedPath = normalizeZipEntryPath(entry.path);
  const segments = normalizedPath.split('/').filter(Boolean);
  const fileName = segments.at(-1) ?? entry.path;
  const extension = getFileExtension(fileName);

  if (isZipSlipPath(entry.path)) {
    issues.push({ code: 'zip_slip_path', severity: 'error', path: entry.path, message: 'ZIP entry uses absolute or parent-directory traversal path.' });
  }
  if (segments.length > UPLOAD_INTAKE_LIMITS.maxZipDepth) {
    issues.push({ code: 'zip_depth_exceeded', severity: 'error', path: entry.path, message: 'ZIP entry nesting is too deep.' });
  }
  if (entry.path.includes('__MACOSX/') || fileName.startsWith('._')) {
    issues.push({ code: 'ignored_system_file', severity: 'warning', path: entry.path, message: 'System metadata files should be ignored during extraction.' });
  }
  if (!entry.isDirectory && isUnsafeFileName(fileName)) {
    issues.push({ code: 'unsafe_zip_entry', severity: 'error', path: entry.path, message: 'ZIP entry is executable, script-like, or unsafe.' });
  }
  if (!entry.isDirectory && !(IMAGE_FILE_EXTENSIONS as readonly string[]).includes(extension)) {
    const severity = (ARCHIVE_FILE_EXTENSIONS as readonly string[]).includes(extension) ? 'error' : 'warning';
    issues.push({ code: severity === 'error' ? 'nested_archive_rejected' : 'non_image_zip_entry', severity, path: entry.path, message: 'Only image files are accepted from ZIP uploads.' });
  }

  return {
    accepted: !entry.isDirectory && !issues.some((issue) => issue.severity === 'error') && (IMAGE_FILE_EXTENSIONS as readonly string[]).includes(extension),
    normalizedPath,
    safeFileName: sanitizeUploadFileName(fileName),
    issues,
  };
}

export function validateZipEntries(entries: ZipEntryMetadata[]) {
  const results = entries.map((entry) => ({ entry, ...validateZipEntry(entry) }));
  const safeEntries = results.filter((result) => result.accepted);
  const rejectedEntries = results.filter((result) => !result.accepted && result.issues.some((issue) => issue.severity === 'error'));
  const warnings = results.flatMap((result) => result.issues.filter((issue) => issue.severity === 'warning'));
  return {
    accepted: rejectedEntries.length === 0 && safeEntries.length > 0,
    safeEntries,
    rejectedEntries,
    warnings,
    summary: {
      totalEntries: entries.length,
      safeImageEntries: safeEntries.length,
      rejectedEntries: rejectedEntries.length,
      warningCount: warnings.length,
    },
  };
}
