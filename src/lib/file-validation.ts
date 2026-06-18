import { allowedArchiveMimeTypes, allowedImageMimeTypes, type UploadFileMetadata } from '@/schemas/upload';

const blockedExtensions = ['.exe', '.bat', '.cmd', '.com', '.scr', '.js', '.mjs', '.sh', '.ps1', '.jar', '.php', '.html', '.svg'];

export function getExtension(fileName: string) {
  const clean = fileName.toLowerCase().split('?')[0] ?? fileName.toLowerCase();
  const dot = clean.lastIndexOf('.');
  return dot >= 0 ? clean.slice(dot) : '';
}

export function isBlockedFileName(fileName: string) {
  const lower = fileName.toLowerCase();
  return blockedExtensions.some((extension) => lower.endsWith(extension));
}

export function validateUploadFile(file: UploadFileMetadata) {
  if (isBlockedFileName(file.fileName)) {
    return { valid: false, reason: 'Executable or unsafe file type rejected.' };
  }
  const allowedMime = [...allowedImageMimeTypes, ...allowedArchiveMimeTypes].includes(file.mimeType as never);
  if (!allowedMime) return { valid: false, reason: 'Unsupported file MIME type.' };
  if (file.sizeBytes <= 0) return { valid: false, reason: 'File is empty.' };
  return { valid: true, reason: null };
}
