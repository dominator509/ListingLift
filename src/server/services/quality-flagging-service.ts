import { evaluateOutputQuality, getQualityFlagDefinition, normalizeQualityFlagKeys, type QualityOutputInput } from '@/domain/quality-control';
import type { CreateQualityFlagInput, ResolveQualityFlagInput } from '@/schemas/quality-control';

export function buildQualityFlagDraft(input: CreateQualityFlagInput, context: { organizationId: string; jobId: string; actorUserId?: string | null }) {
  const definition = getQualityFlagDefinition(input.flagKey);
  const severity = input.severity ?? definition.severity;
  return {
    organizationId: context.organizationId,
    jobId: context.jobId,
    imageId: input.imageId ?? null,
    processedFileId: input.processedFileId,
    previewGalleryItemId: input.previewGalleryItemId ?? null,
    flagKey: input.flagKey,
    category: definition.category,
    severity,
    status: 'OPEN' as const,
    blocksDelivery: definition.blocksDelivery || severity === 'BLOCKER',
    message: input.message,
    suggestedAction: input.suggestedAction ?? definition.suggestedAction,
    adminNotes: input.adminNotes ?? null,
    clientVisible: input.clientVisible,
    createdByUserId: context.actorUserId ?? null,
    auditEvent: 'quality.flag.created',
  };
}

export function buildQualityFlagResolutionDraft(input: ResolveQualityFlagInput, context: { organizationId: string; jobId: string; actorUserId?: string | null }) {
  return {
    organizationId: context.organizationId,
    jobId: context.jobId,
    flagId: input.flagId,
    status: input.status,
    resolution: input.resolution,
    manualReplacementUploaded: input.manualReplacementUploaded,
    resolvedByUserId: context.actorUserId ?? null,
    resolvedAt: new Date().toISOString(),
    auditEvent: input.status === 'RESOLVED' ? 'quality.flag.resolved' : 'quality.flag.dismissed',
  };
}

export function mergeManualFlagsIntoOutput(output: QualityOutputInput, manualFlagKeys: readonly string[]) {
  const flags = normalizeQualityFlagKeys([...(output.flags ?? []), ...manualFlagKeys]);
  return evaluateOutputQuality({ ...output, flags });
}
