import { processImageWithProvider } from './image-processing-pipeline';
import { buildProcessingRunPlan } from './image-processing-output-planner';
import { buildProcessingSteps, summarizeProcessingSteps } from './image-processing-step-planner';
import { buildProcessingErrorFromProvider, summarizeProcessingErrors } from './image-processing-error-service';
import { toProcessedFileDraft, toProcessingRunDraft } from './image-processing-record-service';
import { buildSharpTransformPlan, assertTransformDoesNotOverwriteOriginal } from './image-transform-contract-service';
import type { ProcessingImageInput, ProcessingJobInput } from '@/domain/image-processing';

export type CoreImageProcessingPipelineInput = {
  job: ProcessingJobInput;
  images: ProcessingImageInput[];
  providerKey?: string;
  presetKeys?: string[];
  dryRun?: boolean;
};

export async function runCoreImageProcessingPipeline(input: CoreImageProcessingPipelineInput) {
  const plan = buildProcessingRunPlan({ job: input.job, images: input.images, presetKeys: input.presetKeys, providerKey: input.providerKey });
  const steps = buildProcessingSteps(plan);
  const processedFiles = [];
  const errors = [];
  const transformPlans = [];

  for (const output of plan.outputs) {
    const transformPlan = buildSharpTransformPlan(output);
    assertTransformDoesNotOverwriteOriginal(transformPlan);
    transformPlans.push(transformPlan);
    try {
      const result = await processImageWithProvider(
        {
          organizationId: plan.organizationId,
          jobId: plan.jobId,
          imageId: output.imageId,
          inputStorageKey: output.sourceStorageKey,
          outputBaseKey: output.storageKey.replace(/\/[^/]+$/, ''),
          operations: output.operations,
          presetKey: output.presetKey ?? undefined,
          sourceMimeType: undefined,
          sourceFileName: output.fileName,
          dryRun: input.dryRun ?? true,
        },
        plan.providerKey,
      );
      if (!result.ok) {
        errors.push(buildProcessingErrorFromProvider({ organizationId: plan.organizationId, jobId: plan.jobId, providerKey: plan.providerKey, result }));
        continue;
      }
      processedFiles.push(toProcessedFileDraft(output, plan.organizationId, plan.jobId));
    } catch (error) {
      errors.push(buildProcessingErrorFromProvider({ organizationId: plan.organizationId, jobId: plan.jobId, providerKey: plan.providerKey, error }));
    }
  }

  return {
    run: {
      ...toProcessingRunDraft(plan),
      status: errors.length ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
      totalCreatedOutputs: processedFiles.length,
      totalFailedOutputs: errors.length,
      manualFallbackRequired: errors.some((error) => error.manualFallbackRequired),
    },
    steps,
    processedFiles,
    errors,
    transformPlans,
    summary: {
      outputCount: processedFiles.length,
      errorCount: errors.length,
      ...summarizeProcessingSteps(steps),
      errors: summarizeProcessingErrors(errors),
    },
    nextJobStatus: errors.length ? 'FLAGGED_OUTPUTS' : 'WAITING_FOR_REVIEW',
    note: 'Pipeline output records are drafts until Codex persists them transactionally and writes actual files with Sharp/provider adapters.',
  };
}
