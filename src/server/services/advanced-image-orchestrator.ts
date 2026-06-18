import { advancedImagePlanRequestSchema, advancedImageQueueRequestSchema } from '@/schemas/advanced-image-processing';
import { buildAdvancedImageProcessingPlan } from './advanced-image-plan-service';
import { evaluateAdvancedImageOperationPolicy } from './advanced-image-operation-policy-service';

export async function planAdvancedImageProcessing(raw: unknown) {
  const request = advancedImagePlanRequestSchema.parse(raw);
  const planResult = buildAdvancedImageProcessingPlan(request);
  if (!planResult.plan) return planResult;
  const policy = evaluateAdvancedImageOperationPolicy({
    operationKeys: planResult.plan.operationKeys,
    proposedCopy: planResult.plan.safeClaim,
    includesAutoPublish: false,
    exposesClientFiles: false,
    exposesUnapprovedOutputs: false,
  });
  return { ...planResult, policy };
}

export async function queueAdvancedImageProcessing(raw: unknown) {
  const request = advancedImageQueueRequestSchema.parse(raw);
  return {
    dryRun: request.dryRun,
    jobId: request.jobId,
    recipeKey: request.recipeKey,
    sourceImageIds: request.sourceImageIds,
    status: request.dryRun ? 'DRY_RUN_ONLY' : 'NEEDS_CODEX_PRISMA_AND_STORAGE_RUNTIME',
    createsRecords: ['AdvancedImageProcessingRun', 'AdvancedImageProcessingReport', 'AuditLog'],
    doesNotCreate: ['DeliveryLink', 'DeliveredJob', 'CompletedJob'],
    notes: request.notes ?? null,
  };
}
