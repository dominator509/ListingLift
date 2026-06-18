import { evaluateOutputQuality, summarizeQualityReviews, canMarkOutputQualityPassed, type QualityOutputInput } from '@/domain/quality-control';
import type { BulkQualityReviewInput, QualityReviewDecisionInput } from '@/schemas/quality-control';

export function buildQualityReview(output: QualityOutputInput, context: { organizationId: string; jobId: string; actorUserId?: string | null }) {
  const decision = evaluateOutputQuality(output);
  return {
    ...decision,
    organizationId: context.organizationId,
    jobId: context.jobId,
    processedFileId: output.id,
    reviewKey: `quality-review:${context.jobId}:${output.id}`,
    reviewedByUserId: context.actorUserId ?? null,
    auditEvent: 'quality.review.evaluated',
  };
}

export function buildJobQualityReview(input: { organizationId: string; jobId: string; outputs: QualityOutputInput[]; actorUserId?: string | null }) {
  const reviews = input.outputs.map((output) => buildQualityReview(output, input));
  return {
    organizationId: input.organizationId,
    jobId: input.jobId,
    summary: summarizeQualityReviews(reviews),
    reviews,
    finalDeliveryBlocked: reviews.some((review) => review.finalDeliveryBlocked),
    safeLanguage: 'Internal QC summary only. Final delivery remains hidden until manual approval and delivery workflow gates pass.',
  };
}

export function buildQualityReviewDecision(input: QualityReviewDecisionInput, context: { organizationId: string; jobId: string; actorUserId?: string | null }) {
  const blockFinalDelivery = input.decision !== 'PASS' || input.blockFinalDelivery;
  return {
    organizationId: context.organizationId,
    jobId: context.jobId,
    processedFileId: input.processedFileId,
    decision: input.decision,
    status: input.decision === 'PASS' ? 'PASSED' : input.decision === 'RESOLVE' ? 'RESOLVED' : input.decision === 'NEEDS_MANUAL_REPLACEMENT' ? 'NEEDS_MANUAL_REPLACEMENT' : input.decision === 'FAIL' ? 'FAILED' : 'FLAGGED',
    flagKeys: input.flagKeys,
    qualityScore: input.qualityScore ?? null,
    adminNotes: input.adminNotes ?? null,
    clientVisibleNotes: input.clientVisibleNotes ?? null,
    finalDeliveryBlocked: blockFinalDelivery,
    reviewedByUserId: context.actorUserId ?? null,
    auditEvent: 'quality.review.decision_requested',
    warning: 'QC pass does not equal final delivery approval. Approval and delivery phases remain separate gates.',
  };
}

export function buildBulkQualityReviewDraft(input: BulkQualityReviewInput, context: { organizationId: string; actorUserId?: string | null }) {
  return {
    organizationId: context.organizationId,
    jobId: input.jobId,
    processedFileIds: input.processedFileIds,
    decision: input.decision,
    notes: input.notes ?? null,
    requiresTransaction: true,
    auditEvent: 'quality.bulk_review_requested',
    finalDeliveryReminder: 'Bulk QC actions must not expose final downloads or skip admin approval.',
  };
}

export function assertQualityReviewCanPass(output: QualityOutputInput) {
  const decision = evaluateOutputQuality(output);
  if (!canMarkOutputQualityPassed(decision)) {
    throw new Error(`Output ${output.id} cannot pass QC until blockers are resolved.`);
  }
  return decision;
}
