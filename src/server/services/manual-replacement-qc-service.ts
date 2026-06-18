export type ManualReplacementRequest = {
  organizationId: string;
  jobId: string;
  processedFileId: string;
  reason: string;
  requestedByUserId?: string | null;
};

export function buildManualReplacementQcDraft(input: ManualReplacementRequest) {
  return {
    organizationId: input.organizationId,
    jobId: input.jobId,
    processedFileId: input.processedFileId,
    reason: input.reason,
    required: true,
    suggestedWorkflow: 'Upload a manually edited replacement file, link it to the original processed output, re-run QC, and audit the override before preview/delivery.',
    auditEvent: 'quality.manual_replacement_required',
    requestedByUserId: input.requestedByUserId ?? null,
    finalDeliveryBlocked: true,
  };
}
