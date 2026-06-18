export function sanitizeClientRevisionNotes(notes: string) {
  return notes
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);
}

export function buildClientRevisionRequestDraft(input: { organizationId: string; clientId?: string | null; jobId: string; notes: string; requestedOutputIds?: string[]; revisionAllowance?: number | null; usedRevisions?: number }) {
  const usedRevisions = input.usedRevisions ?? 0;
  const allowance = input.revisionAllowance ?? null;
  const overAllowance = allowance !== null && usedRevisions >= allowance;
  return {
    organizationId: input.organizationId,
    clientId: input.clientId ?? null,
    jobId: input.jobId,
    notes: sanitizeClientRevisionNotes(input.notes),
    requestedOutputIds: input.requestedOutputIds ?? [],
    status: overAllowance ? 'NEEDS_OPERATOR_REVIEW' : 'REQUESTED',
    overAllowance,
    requiresAudit: true,
    blocksCompletionUntilResolved: true,
  };
}
