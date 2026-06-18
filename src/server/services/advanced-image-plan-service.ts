import { getAdvancedImageOperation, getAdvancedImageRecipe, requiresManualFallback, type AdvancedImageOperationKey } from '@/domain/advanced-image-processing';
import type { AdvancedImagePlanRequest } from '@/schemas/advanced-image-processing';

function plannedFilename(input: { originalFilename: string; operationKey: string; index: number }) {
  const safeBase = input.originalFilename
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80) || `image-${input.index + 1}`;
  return `${safeBase}__advanced-${input.operationKey.toLowerCase().replace(/_/g, '-')}.png`;
}

export function buildAdvancedImageProcessingPlan(request: AdvancedImagePlanRequest) {
  const recipe = getAdvancedImageRecipe(request.recipeKey);
  if (!recipe) {
    return { status: 'BLOCKED' as const, errors: [`Unknown recipe ${request.recipeKey}`], plan: null };
  }

  const operationKeys = (request.operationKeys?.length ? request.operationKeys : recipe.operations) as AdvancedImageOperationKey[];
  const operations = operationKeys.map((operationKey) => getAdvancedImageOperation(operationKey)).filter(Boolean);
  const outputSteps = request.sourceFiles.flatMap((file, fileIndex) =>
    operations
      .filter((operation) => operation?.createsNewOutput)
      .map((operation, operationIndex) => ({
        jobId: request.jobId,
        imageId: file.imageId,
        processedFileId: file.processedFileId,
        operationKey: operation!.key,
        outputFolder: `${recipe.defaultOutputFolder}/${operation!.key.toLowerCase().replace(/_/g, '-')}`,
        outputFilename: plannedFilename({ originalFilename: file.originalFilename, operationKey: operation!.key, index: fileIndex + operationIndex }),
        requiresAdminApproval: operation!.requiresAdminApproval,
        clientVisibleByDefault: false,
        status: file.status === 'FAILED' || file.status === 'REJECTED' ? 'BLOCKED' : 'PLANNED',
      })),
  );

  const reportSteps = operations
    .filter((operation) => !operation?.createsNewOutput)
    .map((operation) => ({ jobId: request.jobId, operationKey: operation!.key, status: 'PLANNED', clientVisibleByDefault: false }));

  return {
    status: outputSteps.some((step) => step.status === 'BLOCKED') ? 'MANUAL_ONLY' : 'READY',
    errors: [],
    plan: {
      jobId: request.jobId,
      recipeKey: recipe.key,
      operationKeys,
      outputSteps,
      reportSteps,
      estimatedOutputCount: outputSteps.length,
      requiresManualFallback: request.manualFallbackAllowed && requiresManualFallback(operationKeys),
      requiresAdminApproval: true,
      sellerReviewRequired: true,
      safeClaim: recipe.safeClaim,
    },
  };
}
