import { evaluateOutputQuality, type QualityOutputInput } from '@/domain/quality-control';

export function buildFlaggedOutputQueue(input: { organizationId: string; jobId?: string; outputs: QualityOutputInput[] }) {
  const reviews = input.outputs.map(evaluateOutputQuality);
  const flagged = reviews.filter((review) => review.status === 'FLAGGED' || review.status === 'FAILED' || review.finalDeliveryBlocked);
  return {
    organizationId: input.organizationId,
    jobId: input.jobId ?? null,
    totalOutputs: input.outputs.length,
    flaggedCount: flagged.length,
    blockerCount: flagged.reduce((sum, review) => sum + review.blockerCount, 0),
    manualFallbackRequired: flagged.some((review) => review.manualFallbackRequired),
    items: flagged,
    emptyState: flagged.length === 0 ? 'No flagged outputs in this dry-run input.' : null,
  };
}

export function getFlaggedOutputReason(output: QualityOutputInput) {
  const decision = evaluateOutputQuality(output);
  if (decision.flags.length === 0 && decision.status !== 'FAILED') return 'No explicit QC flag.';
  return decision.flags.map((flag) => `${flag.label}: ${flag.suggestedAction}`).join(' | ') || decision.recommendedAction;
}
