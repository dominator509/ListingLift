import type { ProcessingOutputDraft, ProcessingRunPlan, ProcessingStepDraft } from '@/domain/image-processing';

const ORDERED_STEPS = ['metadata-read', 'remove-background', 'transparent-png', 'white-background', 'webp', 'resize', 'compress', 'preset-output'] as const;

function stepsForOutput(output: ProcessingOutputDraft, organizationId: string, jobId: string, providerKey: string): ProcessingStepDraft[] {
  const providerOperations = new Set(output.operations);
  const steps: ProcessingStepDraft[] = ORDERED_STEPS.filter((operation) => operation === 'preset-output' || providerOperations.has(operation)).map((operation) => ({
    organizationId,
    jobId,
    imageId: output.imageId,
    providerKey,
    operation,
    status: 'PLANNED',
    inputStorageKey: output.sourceStorageKey,
    outputStorageKey: operation === 'preset-output' || operation === 'compress' || operation === 'resize' ? output.storageKey : null,
    presetKey: output.presetKey ?? null,
    outputType: output.outputType,
    outputFormat: output.outputFormat,
    backgroundType: output.backgroundType ?? null,
    metadata: {
      fileName: output.fileName,
      folderPath: output.folderPath,
      sellerReviewRequired: output.sellerReviewRequired,
      manualFallbackAllowed: output.manualFallbackAllowed,
    },
  }));
  return steps;
}

export function buildProcessingSteps(plan: ProcessingRunPlan): ProcessingStepDraft[] {
  return plan.outputs.flatMap((output) => stepsForOutput(output, plan.organizationId, plan.jobId, plan.providerKey));
}

export function summarizeProcessingSteps(steps: ProcessingStepDraft[]) {
  const byOperation = steps.reduce<Record<string, number>>((acc, step) => {
    acc[step.operation] = (acc[step.operation] ?? 0) + 1;
    return acc;
  }, {});
  return {
    totalSteps: steps.length,
    byOperation,
    planned: steps.filter((step) => step.status === 'PLANNED').length,
    failed: steps.filter((step) => step.status === 'FAILED').length,
    manualFallbackRequired: steps.some((step) => step.status === 'MANUAL_FALLBACK_REQUIRED'),
  };
}
