import type { ProcessingOutputDraft, ProcessingRunPlan, ProcessingStepDraft, ImageProcessingErrorDraft } from '@/domain/image-processing';

export function toProcessedFileDraft(output: ProcessingOutputDraft, organizationId: string, jobId: string) {
  return {
    organizationId,
    jobId,
    imageId: output.imageId,
    presetKey: output.presetKey ?? null,
    outputType: output.outputType,
    outputFormat: output.outputFormat,
    backgroundType: output.backgroundType ?? null,
    fileName: output.fileName,
    folderPath: output.folderPath,
    storageKey: output.storageKey,
    outputFileUrl: null,
    mimeType: output.mimeType,
    width: output.width ?? null,
    height: output.height ?? null,
    sizeBytes: null,
    qualityScore: null,
    status: 'READY_FOR_REVIEW',
    approvedStatus: 'PENDING',
    metadata: output.metadata,
  };
}

export function toProcessingRunDraft(plan: ProcessingRunPlan) {
  return {
    organizationId: plan.organizationId,
    jobId: plan.jobId,
    providerKey: plan.providerKey,
    status: plan.status,
    totalImages: plan.imageCount,
    totalRequestedOutputs: plan.outputCount,
    totalCreatedOutputs: 0,
    totalFailedOutputs: 0,
    manualFallbackRequired: plan.manualFallbackRequired,
    selectedPresetKeys: plan.selectedPresetKeys,
    operations: plan.operations,
    metadata: plan.metadata,
  };
}

export function toProcessingStepRecordDraft(step: ProcessingStepDraft) {
  return { ...step, metadata: { ...step.metadata, generatedBy: 'phase11-core-image-processing-pipeline' } };
}

export function toProcessingErrorRecordDraft(error: ImageProcessingErrorDraft) {
  return { ...error, safeDetails: { ...error.safeDetails, redacted: true } };
}
