import { DEFAULT_DELIVERY_ROOT_FOLDER, type OutputFormat, type PlatformPreset } from './platform-presets';

export const DELIVERY_ARCHIVE_STATUSES = ['PLANNED', 'GENERATING', 'READY_FOR_REVIEW', 'APPROVED', 'FAILED', 'REVOKED'] as const;
export type DeliveryArchiveStatus = (typeof DELIVERY_ARCHIVE_STATUSES)[number];

export const DELIVERY_ARCHIVE_FILE_KINDS = ['OUTPUT', 'MANIFEST', 'README', 'BEFORE_AFTER', 'QUALITY_REPORT', 'SOURCE_REFERENCE'] as const;
export type DeliveryArchiveFileKind = (typeof DELIVERY_ARCHIVE_FILE_KINDS)[number];

export const MANIFEST_STATUSES = ['planned', 'included', 'missing', 'failed', 'manual_replacement', 'excluded'] as const;
export type ManifestStatus = (typeof MANIFEST_STATUSES)[number];

export const DEFAULT_DELIVERY_SAFE_LANGUAGE = [
  'Files are platform-ready drafts formatted for common marketplace and ecommerce use.',
  'Seller review is recommended before publishing.',
  'Review against current platform guidelines before upload.',
  'ListingLift does not guarantee marketplace approval, ranking, sales, conversion lift, ad performance, or listing approval.',
] as const;

export const REQUIRED_DELIVERY_ROOT_FOLDERS = [
  'Amazon/white-background',
  'Amazon/secondary-images',
  'Etsy/square-listing',
  'Shopify/product-gallery',
  'TikTok-Shop/vertical',
  'Instagram/square',
  'Instagram/story',
  'Transparent-PNG',
  'White-JPG',
  'Before-After',
] as const;

export const DELIVERY_MANIFEST_COLUMNS = [
  'archive_path',
  'source_image',
  'output_file',
  'source_image_id',
  'processed_file_id',
  'preset_key',
  'platform',
  'folder_path',
  'width',
  'height',
  'format',
  'output_type',
  'background_type',
  'status',
  'seller_review_required',
  'notes',
] as const;

export type DeliveryProcessedFileInput = {
  id: string;
  imageId?: string | null;
  sourceImageName?: string | null;
  presetKey?: string | null;
  platform?: string | null;
  outputType: string;
  outputFormat: OutputFormat | string;
  backgroundType?: string | null;
  fileName: string;
  folderPath: string;
  storageKey: string;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  sizeBytes?: number | null;
  status?: string | null;
  approvedStatus?: string | null;
  sellerReviewRequired?: boolean | null;
  notes?: string | null;
};

export type DeliveryArchiveInput = {
  organizationId: string;
  jobId: string;
  jobNumber?: string | null;
  clientName: string;
  selectedPresets: PlatformPreset[];
  processedFiles: DeliveryProcessedFileInput[];
  includeBeforeAfter?: boolean;
  includeReadme?: boolean;
  includeManifest?: boolean;
  generatedByUserId?: string | null;
};

export type DeliveryArchiveFilePlan = {
  kind: DeliveryArchiveFileKind;
  processedFileId?: string | null;
  sourceImageId?: string | null;
  sourceImageName?: string | null;
  presetKey?: string | null;
  platform?: string | null;
  folderPath: string;
  fileName: string;
  archivePath: string;
  storageKey?: string | null;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  sizeBytes?: number | null;
  format: string;
  outputType?: string | null;
  backgroundType?: string | null;
  status: ManifestStatus;
  sellerReviewRequired: boolean;
  notes?: string | null;
};

export type DeliveryArchivePlan = {
  organizationId: string;
  jobId: string;
  jobNumber?: string | null;
  clientName: string;
  rootFolder: string;
  status: DeliveryArchiveStatus;
  files: DeliveryArchiveFilePlan[];
  folders: string[];
  manifestCsv: string;
  readmeText: string;
  zipFileName: string;
  zipStorageKey: string;
  fileCount: number;
  outputCount: number;
  missingCount: number;
  sellerReviewRequired: boolean;
  metadata: Record<string, unknown>;
};

export function normalizeDeliverySegment(value: string, fallback = 'item') {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')
    .slice(0, 96);
  return normalized || fallback;
}

export function normalizeDeliveryFolderPath(value: string) {
  const normalized = value.replace(/\\/g, '/');
  if (!normalized) return '';
  if (normalized.startsWith('/') || /^[a-zA-Z]:\//.test(normalized)) {
    throw new Error(`Unsafe delivery folder path rejected: ${value}`);
  }
  const segments = normalized.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new Error(`Unsafe delivery folder path rejected: ${value}`);
  }
  return segments
    .map((segment) => normalizeDeliverySegment(segment, 'folder'))
    .filter(Boolean)
    .join('/');
}

export function assertSafeDeliveryRelativePath(path: string) {
  const normalized = path.replace(/\\/g, '/');
  if (!normalized || normalized.startsWith('/') || normalized.includes('../') || normalized === '..' || /^[a-zA-Z]:\//.test(normalized)) {
    throw new Error(`Unsafe delivery archive path rejected: ${path}`);
  }
  for (const segment of normalized.split('/')) {
    if (!segment || segment === '.' || segment === '..') throw new Error(`Unsafe delivery archive segment rejected: ${path}`);
  }
}

export function buildDeliveryRootFolder(input: { clientName: string; jobNumberOrId: string }) {
  const client = normalizeDeliverySegment(input.clientName, 'ClientName');
  const job = normalizeDeliverySegment(input.jobNumberOrId, 'Job');
  return `${DEFAULT_DELIVERY_ROOT_FOLDER}_${client}_${job}`;
}

export function buildDeliveryZipFileName(input: { clientName: string; jobNumberOrId: string }) {
  return `${buildDeliveryRootFolder(input)}.zip`;
}

export function buildDeliveryZipStorageKey(input: { organizationId: string; jobId: string; rootFolder: string }) {
  const org = normalizeDeliverySegment(input.organizationId, 'org');
  const job = normalizeDeliverySegment(input.jobId, 'job');
  const root = normalizeDeliverySegment(input.rootFolder, 'delivery');
  return `deliveries/${org}/${job}/${root}.zip`;
}
