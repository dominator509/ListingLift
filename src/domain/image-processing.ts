import type { ImageProviderOperation } from './image-providers';
import type { BackgroundType, OutputFormat, PlatformPreset } from './platform-presets';

export const PROCESSING_RUN_STATUSES = ['PLANNED', 'QUEUED', 'RUNNING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED', 'CANCELLED'] as const;
export type ProcessingRunStatus = (typeof PROCESSING_RUN_STATUSES)[number];

export const PROCESSING_STEP_STATUSES = ['PLANNED', 'SKIPPED', 'RUNNING', 'COMPLETED', 'FAILED', 'MANUAL_FALLBACK_REQUIRED'] as const;
export type ProcessingStepStatus = (typeof PROCESSING_STEP_STATUSES)[number];

export const CORE_PROCESSING_OPERATIONS = [
  'metadata-read',
  'remove-background',
  'transparent-png',
  'white-background',
  'webp',
  'resize',
  'compress',
  'preset-output',
] as const;

export type CoreProcessingOperation = (typeof CORE_PROCESSING_OPERATIONS)[number];

export type ProcessingOutputType =
  | 'TRANSPARENT_PNG'
  | 'WHITE_JPG'
  | 'WEBP'
  | 'SQUARE_ECOMMERCE'
  | 'VERTICAL_SOCIAL'
  | 'HERO_IMAGE'
  | 'THUMBNAIL'
  | 'CUSTOM';

export type ProcessingOutputDraft = {
  imageId: string;
  sourceStorageKey: string;
  presetKey?: string | null;
  outputType: ProcessingOutputType;
  outputFormat: OutputFormat;
  backgroundType?: BackgroundType | null;
  width?: number | null;
  height?: number | null;
  folderPath: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  operations: ImageProviderOperation[];
  sellerReviewRequired: boolean;
  manualFallbackAllowed: boolean;
  metadata: Record<string, unknown>;
};

export type ProcessingImageInput = {
  id: string;
  organizationId: string;
  jobId: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  status?: string;
};

export type ProcessingJobInput = {
  id: string;
  organizationId: string;
  jobNumber?: string | null;
  selectedPresetKeys?: string[] | null;
  backgroundPreference?: string | null;
  fileFormat?: string | null;
  status?: string | null;
};

export type ProcessingRunPlan = {
  organizationId: string;
  jobId: string;
  providerKey: string;
  status: ProcessingRunStatus;
  imageCount: number;
  outputCount: number;
  selectedPresetKeys: string[];
  operations: CoreProcessingOperation[];
  outputs: ProcessingOutputDraft[];
  manualFallbackRequired: boolean;
  metadata: Record<string, unknown>;
};

export type ProcessingStepDraft = {
  organizationId: string;
  jobId: string;
  imageId: string;
  providerKey: string;
  operation: CoreProcessingOperation;
  status: ProcessingStepStatus;
  inputStorageKey: string;
  outputStorageKey?: string | null;
  presetKey?: string | null;
  outputType?: ProcessingOutputType | null;
  outputFormat?: OutputFormat | null;
  backgroundType?: BackgroundType | null;
  metadata: Record<string, unknown>;
};

export type ImageProcessingErrorDraft = {
  organizationId: string;
  jobId: string;
  imageId?: string | null;
  providerKey?: string | null;
  code: string;
  message: string;
  retryable: boolean;
  manualFallbackRequired: boolean;
  safeDetails: Record<string, unknown>;
};

export const CORE_PROCESSING_ACCEPTED_IMAGE_STATUSES = ['ORIGINAL_UPLOADED', 'FAILED', 'MANUAL_REPLACEMENT_UPLOADED'] as const;

export function normalizeProcessingFileBaseName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .toLowerCase() || 'product-image';
}

export function mimeTypeForOutputFormat(format: OutputFormat) {
  switch (format) {
    case 'JPG':
      return 'image/jpeg';
    case 'PNG':
      return 'image/png';
    case 'WEBP':
      return 'image/webp';
    case 'CSV':
      return 'text/csv';
    case 'TXT':
      return 'text/plain';
    case 'ZIP':
      return 'application/zip';
    case 'PDF':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

export function extensionForProcessingFormat(format: OutputFormat) {
  switch (format) {
    case 'JPG':
      return 'jpg';
    case 'PNG':
      return 'png';
    case 'WEBP':
      return 'webp';
    case 'CSV':
      return 'csv';
    case 'TXT':
      return 'txt';
    case 'ZIP':
      return 'zip';
    case 'PDF':
      return 'pdf';
    default:
      return 'bin';
  }
}

export function outputTypeForPreset(preset: PlatformPreset): ProcessingOutputType {
  if (preset.supportsTransparent || preset.background === 'TRANSPARENT') return 'TRANSPARENT_PNG';
  if (preset.background === 'WHITE' && preset.format === 'JPG') return 'WHITE_JPG';
  if (preset.format === 'WEBP') return 'WEBP';
  if (preset.orientation === 'vertical') return 'VERTICAL_SOCIAL';
  if (preset.orientation === 'square') return 'SQUARE_ECOMMERCE';
  return 'CUSTOM';
}

export function providerOperationsForOutput(output: Pick<ProcessingOutputDraft, 'outputFormat' | 'backgroundType' | 'width' | 'height'>): ImageProviderOperation[] {
  const operations: ImageProviderOperation[] = ['metadata-read'];
  if (output.backgroundType === 'TRANSPARENT') operations.push('remove-background', 'transparent-png');
  if (output.backgroundType === 'WHITE') operations.push('remove-background', 'white-background');
  if (output.outputFormat === 'WEBP') operations.push('webp');
  if (output.width && output.height) operations.push('resize');
  operations.push('compress');
  return Array.from(new Set(operations));
}

export function processingOutputBaseKey(jobNumberOrId: string, imageId: string) {
  const safeJob = normalizeProcessingFileBaseName(jobNumberOrId);
  return `processed/${safeJob}/${imageId}`;
}

export function assertOriginalPreserved(input: { sourceStorageKey: string; outputStorageKey: string }) {
  if (input.sourceStorageKey === input.outputStorageKey) {
    throw new Error('Original uploads must never be overwritten by processing outputs.');
  }
  if (!input.outputStorageKey.includes('/processed/') && !input.outputStorageKey.startsWith('processed/')) {
    throw new Error('Processing outputs must use a processed storage namespace.');
  }
}

export function summarizeProcessingPlan(plan: Pick<ProcessingRunPlan, 'imageCount' | 'outputCount' | 'manualFallbackRequired'>) {
  return {
    imageCount: plan.imageCount,
    outputCount: plan.outputCount,
    outputsPerImage: plan.imageCount > 0 ? Math.round((plan.outputCount / plan.imageCount) * 100) / 100 : 0,
    manualFallbackRequired: plan.manualFallbackRequired,
  };
}
