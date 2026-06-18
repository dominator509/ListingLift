import type { ApprovalReadiness } from '@/domain/manual-approval';

export function buildDeliveryApprovalGate(input: { jobId: string; jobApproved: boolean; approvalReadiness: ApprovalReadiness; deliveryArchiveApproved?: boolean; deliveryLinkActive?: boolean }) {
  const blockers: string[] = [];
  if (!input.jobApproved) blockers.push('Job has not received manual admin approval.');
  if (!input.approvalReadiness.canApproveJob) blockers.push(...input.approvalReadiness.blockers);
  if (!input.deliveryArchiveApproved) blockers.push('Delivery archive has not been approved for release.');
  return {
    jobId: input.jobId,
    canCreateDeliveryLink: blockers.length === 0,
    canExposeClientDownload: blockers.length === 0 && Boolean(input.deliveryLinkActive),
    blockers,
    safeLanguage: 'Delivery may only be exposed after manual approval, archive readiness, expiring delivery link creation, and permission checks.',
  };
}
