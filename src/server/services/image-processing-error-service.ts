import type { ImageProviderError, ImageProcessingResult } from '@/server/adapters/image/types';
import type { ImageProcessingErrorDraft, ProcessingImageInput } from '@/domain/image-processing';

export function buildProcessingErrorFromProvider(input: {
  organizationId: string;
  jobId: string;
  image?: ProcessingImageInput | null;
  providerKey?: string | null;
  result?: ImageProcessingResult | null;
  error?: unknown;
}): ImageProcessingErrorDraft {
  const normalized = input.result?.normalizedError;
  if (normalized) return processingErrorFromNormalized(input.organizationId, input.jobId, input.image?.id ?? null, normalized);
  const message = input.error instanceof Error ? input.error.message : input.result?.error ?? 'Unknown image-processing error.';
  return {
    organizationId: input.organizationId,
    jobId: input.jobId,
    imageId: input.image?.id ?? null,
    providerKey: input.providerKey ?? input.result?.providerKey ?? null,
    code: 'processing_failed',
    message,
    retryable: false,
    manualFallbackRequired: true,
    safeDetails: { source: 'phase11-core-image-processing-pipeline' },
  };
}

export function processingErrorFromNormalized(organizationId: string, jobId: string, imageId: string | null, error: ImageProviderError): ImageProcessingErrorDraft {
  return {
    organizationId,
    jobId,
    imageId,
    providerKey: error.providerKey,
    code: error.code,
    message: error.message,
    retryable: error.retryable,
    manualFallbackRequired: error.manualFallbackRequired,
    safeDetails: error.safeDetails ?? {},
  };
}

export function summarizeProcessingErrors(errors: ImageProcessingErrorDraft[]) {
  return {
    total: errors.length,
    retryable: errors.filter((error) => error.retryable).length,
    manualFallbackRequired: errors.filter((error) => error.manualFallbackRequired).length,
    codes: Array.from(new Set(errors.map((error) => error.code))),
  };
}
