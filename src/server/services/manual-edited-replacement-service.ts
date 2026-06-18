import type { ManualReplacementMarkerInput } from '@/schemas/manual-approval';

export function buildManualReplacementMarker(input: ManualReplacementMarkerInput, context: { organizationId: string; actorUserId?: string | null }) {
  return {
    organizationId: context.organizationId,
    jobId: input.jobId,
    imageId: input.imageId ?? null,
    processedFileId: input.processedFileId ?? null,
    replacementFileName: input.replacementFileName,
    replacementStorageKey: input.replacementStorageKey ?? null,
    notes: input.notes ?? null,
    sourceTool: input.sourceTool,
    nextProcessedFileStatus: 'REPLACED_MANUALLY',
    nextJobStatus: 'WAITING_FOR_REVIEW',
    auditEvent: 'manual_replacement.marker_created',
    requiresStorageValidation: true,
    requiresTransaction: true,
  };
}
