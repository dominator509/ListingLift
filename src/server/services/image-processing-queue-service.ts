import { buildProcessingRunPlan } from './image-processing-output-planner';
import { buildProcessingSteps, summarizeProcessingSteps } from './image-processing-step-planner';
import { summarizeProcessingPlan, type ProcessingImageInput, type ProcessingJobInput } from '@/domain/image-processing';

export type ProcessingQueueDraftInput = {
  job: ProcessingJobInput;
  images: ProcessingImageInput[];
  providerKey?: string;
  presetKeys?: string[];
};

export function createProcessingQueueDraft(input: ProcessingQueueDraftInput) {
  const plan = buildProcessingRunPlan(input);
  const steps = buildProcessingSteps(plan);
  return {
    run: { ...plan, status: 'QUEUED' as const },
    steps,
    summary: {
      ...summarizeProcessingPlan(plan),
      ...summarizeProcessingSteps(steps),
    },
    jobStatusPatch: {
      status: 'PROCESSING_QUEUED',
      fulfillmentStatus: 'IN_PROGRESS',
      uploadStatus: 'COMPLETE',
    },
    auditAction: 'processing.queue.created',
  };
}

export function canQueueProcessingForJob(jobStatus?: string | null) {
  return ['UPLOAD_RECEIVED', 'PROCESSING_QUEUED', 'FAILED', 'REPROCESSING'].includes(jobStatus ?? 'UPLOAD_RECEIVED');
}
