export const APP_NAME = 'ListingLift';
export const SAFE_MARKETPLACE_LANGUAGE = [
  'platform-ready draft',
  'seller-review recommended',
  'formatted for common marketplace use',
  'review against current platform guidelines before publishing',
  'not a guarantee of marketplace approval',
] as const;

export const MAX_UPLOAD_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_ZIP_UPLOAD_BYTES = 500 * 1024 * 1024;
export const TOKEN_BYTE_LENGTH = 32;

export const DELIVERY_ROOT_FOLDER_TEMPLATE = 'ListingLift_Delivery_{clientName}_{jobId}';

export const FORBIDDEN_FILE_EXTENSIONS = [
  '.exe', '.dll', '.bat', '.cmd', '.sh', '.ps1', '.jar', '.msi', '.app', '.scr', '.com', '.php', '.pl', '.py', '.rb'
] as const;

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/tiff',
] as const;

export const ALLOWED_ARCHIVE_MIME_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
] as const;
