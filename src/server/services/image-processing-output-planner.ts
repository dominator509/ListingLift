import { DEFAULT_PLATFORM_PRESETS, getPlatformPresetByKey } from '@/domain/platform-presets';
import {
  assertOriginalPreserved,
  extensionForProcessingFormat,
  mimeTypeForOutputFormat,
  normalizeProcessingFileBaseName,
  outputTypeForPreset,
  processingOutputBaseKey,
  providerOperationsForOutput,
  type ProcessingImageInput,
  type ProcessingJobInput,
  type ProcessingOutputDraft,
  type ProcessingRunPlan,
} from '@/domain/image-processing';

const FALLBACK_PRESET_KEYS = ['TransparentPngCutout', 'WhiteJpgCatalog', 'SquareMarketplaceDraft', 'VerticalSocialDraft'] as const;

export function resolveProcessingPresetKeys(job: Pick<ProcessingJobInput, 'selectedPresetKeys'>, requestedPresetKeys?: string[]) {
  const requested = requestedPresetKeys?.filter(Boolean) ?? [];
  const selected = job.selectedPresetKeys?.filter(Boolean) ?? [];
  const keys = requested.length ? requested : selected.length ? selected : Array.from(FALLBACK_PRESET_KEYS);
  return Array.from(new Set(keys)).filter((key) => Boolean(getPlatformPresetByKey(key)));
}

export function buildProcessingOutputsForImage(input: {
  job: ProcessingJobInput;
  image: ProcessingImageInput;
  presetKeys?: string[];
  providerKey: string;
}): ProcessingOutputDraft[] {
  const presetKeys = resolveProcessingPresetKeys(input.job, input.presetKeys);
  return presetKeys.map((presetKey, index) => {
    const preset = getPlatformPresetByKey(presetKey) ?? DEFAULT_PLATFORM_PRESETS[0];
    const baseName = normalizeProcessingFileBaseName(input.image.originalName);
    const extension = extensionForProcessingFormat(preset.format);
    const outputType = outputTypeForPreset(preset);
    const suffix = normalizeProcessingFileBaseName(preset.name);
    const fileName = `${baseName}_${suffix}.${extension}`;
    const folderPath = preset.folderPath.replace(/^\/+|\/+$/g, '');
    const storageKey = `${processingOutputBaseKey(input.job.jobNumber ?? input.job.id, input.image.id)}/${folderPath}/${fileName}`;
    const draft: ProcessingOutputDraft = {
      imageId: input.image.id,
      sourceStorageKey: input.image.storageKey,
      presetKey: preset.key,
      outputType,
      outputFormat: preset.format,
      backgroundType: preset.background,
      width: preset.width,
      height: preset.height,
      folderPath,
      fileName,
      storageKey,
      mimeType: mimeTypeForOutputFormat(preset.format),
      operations: providerOperationsForOutput({ outputFormat: preset.format, backgroundType: preset.background, width: preset.width, height: preset.height }),
      sellerReviewRequired: preset.sellerReviewRequired,
      manualFallbackAllowed: true,
      metadata: {
        presetKey: preset.key,
        platform: preset.platform,
        recommendedUse: preset.recommendedUse,
        safeLanguage: preset.safeLanguage,
        marketplaceSafeClaim: preset.marketplaceSafeClaim,
        outputIndex: index,
        originalsPreserved: true,
      },
    };
    assertOriginalPreserved({ sourceStorageKey: draft.sourceStorageKey, outputStorageKey: draft.storageKey });
    return draft;
  });
}

export function buildProcessingRunPlan(input: {
  job: ProcessingJobInput;
  images: ProcessingImageInput[];
  presetKeys?: string[];
  providerKey?: string;
}): ProcessingRunPlan {
  const providerKey = input.providerKey ?? 'mock-image-provider';
  const selectedPresetKeys = resolveProcessingPresetKeys(input.job, input.presetKeys);
  const outputs = input.images.flatMap((image) => buildProcessingOutputsForImage({ job: input.job, image, presetKeys: selectedPresetKeys, providerKey }));
  const operations = Array.from(new Set(outputs.flatMap((output) => output.operations))).map((operation) => {
    if (operation === 'remove-background') return 'remove-background';
    if (operation === 'transparent-png') return 'transparent-png';
    if (operation === 'white-background') return 'white-background';
    if (operation === 'webp') return 'webp';
    if (operation === 'resize') return 'resize';
    if (operation === 'compress') return 'compress';
    if (operation === 'metadata-read') return 'metadata-read';
    return 'preset-output';
  });
  return {
    organizationId: input.job.organizationId,
    jobId: input.job.id,
    providerKey,
    status: 'PLANNED',
    imageCount: input.images.length,
    outputCount: outputs.length,
    selectedPresetKeys,
    operations: Array.from(new Set([...operations, 'preset-output'])) as ProcessingRunPlan['operations'],
    outputs,
    manualFallbackRequired: false,
    metadata: {
      source: 'phase11-core-image-processing-pipeline',
      originalsPreserved: true,
      finalDeliveryRequiresApproval: true,
      outputsRequireReview: true,
    },
  };
}
