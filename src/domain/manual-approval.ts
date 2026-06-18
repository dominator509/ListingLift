export const MANUAL_APPROVAL_DECISIONS = [
  'APPROVE_JOB',
  'REJECT_JOB',
  'REQUEST_REVISION',
  'BLOCK_DELIVERY',
  'MARK_READY_FOR_DELIVERY',
] as const;
export type ManualApprovalDecision = (typeof MANUAL_APPROVAL_DECISIONS)[number];

export const OUTPUT_APPROVAL_DECISIONS = ['APPROVE_OUTPUT', 'REJECT_OUTPUT', 'REQUEST_REPROCESS', 'REQUEST_MANUAL_REPLACEMENT'] as const;
export type OutputApprovalDecision = (typeof OUTPUT_APPROVAL_DECISIONS)[number];

export const APPROVAL_GATE_STATUSES = [
  'WAITING_FOR_QC',
  'READY_FOR_ADMIN_REVIEW',
  'BLOCKED_BY_FLAGS',
  'BLOCKED_BY_REVISIONS',
  'APPROVED',
  'REJECTED',
  'REVISION_REQUESTED',
] as const;
export type ApprovalGateStatus = (typeof APPROVAL_GATE_STATUSES)[number];

export const REVISION_WORKFLOW_STATUSES = ['OPEN', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_FOR_CLIENT', 'RESOLVED', 'REJECTED', 'CANCELLED'] as const;
export type RevisionWorkflowStatus = (typeof REVISION_WORKFLOW_STATUSES)[number];

export type OutputApprovalInput = {
  id: string;
  fileName: string;
  status?: string | null;
  approvalStatus?: string | null;
  qualityStatus?: string | null;
  unresolvedBlockingFlags?: number | null;
  manualReplacementRequired?: boolean | null;
  clientVisible?: boolean | null;
};

export type ApprovalReadinessInput = {
  jobId: string;
  jobStatus?: string | null;
  outputCount: number;
  approvedOutputCount: number;
  rejectedOutputCount?: number;
  unresolvedBlockingFlags: number;
  openRevisionCount: number;
  manualReplacementRequiredCount: number;
  outputs?: OutputApprovalInput[];
};

export type ApprovalReadiness = {
  jobId: string;
  status: ApprovalGateStatus;
  canApproveJob: boolean;
  canExposeDelivery: boolean;
  blockers: string[];
  warnings: string[];
  requiredActions: string[];
  safeLanguage: string;
};

export function normalizeApprovalStatus(value?: string | null) {
  return (value ?? 'PENDING').trim().toUpperCase();
}

export function isOutputApproved(output: OutputApprovalInput) {
  return normalizeApprovalStatus(output.approvalStatus) === 'APPROVED' || normalizeApprovalStatus(output.status) === 'APPROVED';
}

export function isOutputRejected(output: OutputApprovalInput) {
  return normalizeApprovalStatus(output.approvalStatus) === 'REJECTED' || normalizeApprovalStatus(output.status) === 'REJECTED';
}

export function evaluateApprovalReadiness(input: ApprovalReadinessInput): ApprovalReadiness {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const requiredActions: string[] = [];

  if (input.outputCount <= 0) {
    blockers.push('No processed outputs are available for approval.');
    requiredActions.push('Process or upload replacement outputs before approval.');
  }
  if (input.unresolvedBlockingFlags > 0) {
    blockers.push(`${input.unresolvedBlockingFlags} unresolved blocking quality flag(s) remain.`);
    requiredActions.push('Resolve blocking QC flags before approving the job.');
  }
  if (input.openRevisionCount > 0) {
    blockers.push(`${input.openRevisionCount} open revision request(s) remain.`);
    requiredActions.push('Resolve or reject open revision requests before final approval.');
  }
  if (input.manualReplacementRequiredCount > 0) {
    blockers.push(`${input.manualReplacementRequiredCount} output(s) require manual replacement.`);
    requiredActions.push('Upload manually edited replacements or reject affected outputs.');
  }
  if (input.rejectedOutputCount && input.rejectedOutputCount > 0) {
    warnings.push(`${input.rejectedOutputCount} rejected output(s) will be excluded from delivery.`);
  }
  if (input.outputCount > 0 && input.approvedOutputCount < input.outputCount) {
    warnings.push('Not every output is approved; only approved outputs may be packaged for delivery.');
    requiredActions.push('Approve, reject, or replace all required outputs.');
  }

  const canApproveJob = blockers.length === 0 && input.outputCount > 0 && input.approvedOutputCount > 0;
  const status: ApprovalGateStatus = canApproveJob
    ? 'READY_FOR_ADMIN_REVIEW'
    : input.openRevisionCount > 0
      ? 'BLOCKED_BY_REVISIONS'
      : input.unresolvedBlockingFlags > 0
        ? 'BLOCKED_BY_FLAGS'
        : 'WAITING_FOR_QC';

  return {
    jobId: input.jobId,
    status,
    canApproveJob,
    canExposeDelivery: false,
    blockers,
    warnings,
    requiredActions,
    safeLanguage: 'Admin approval prepares a job for delivery workflow only. Client downloads remain hidden until delivery links are created and explicitly released.',
  };
}

export function buildOutputApprovalEvent(input: { processedFileId: string; decision: OutputApprovalDecision; actorUserId?: string | null; notes?: string | null }) {
  const blocksDelivery = input.decision !== 'APPROVE_OUTPUT';
  return {
    processedFileId: input.processedFileId,
    decision: input.decision,
    blocksDelivery,
    statusAfterDecision: input.decision === 'APPROVE_OUTPUT' ? 'APPROVED' : input.decision === 'REJECT_OUTPUT' ? 'REJECTED' : input.decision === 'REQUEST_REPROCESS' ? 'REPROCESSING' : 'MANUAL_REPLACEMENT_REQUIRED',
    actorUserId: input.actorUserId ?? null,
    notes: input.notes ?? null,
    auditEvent: 'approval.output_decision_requested',
  };
}

export function buildManualJobApprovalEvent(input: { jobId: string; decision: ManualApprovalDecision; actorUserId?: string | null; notes?: string | null; readiness: ApprovalReadiness }) {
  const approved = input.decision === 'APPROVE_JOB' && input.readiness.canApproveJob;
  return {
    jobId: input.jobId,
    decision: input.decision,
    approved,
    finalDeliveryAllowed: false,
    nextJobStatus: approved ? 'APPROVED' : input.decision === 'REQUEST_REVISION' ? 'REVISION_REQUESTED' : input.decision === 'REJECT_JOB' ? 'WAITING_FOR_REVIEW' : 'FLAGGED_OUTPUTS',
    actorUserId: input.actorUserId ?? null,
    notes: input.notes ?? null,
    blockers: input.readiness.blockers,
    warnings: input.readiness.warnings,
    auditEvent: 'approval.job_decision_requested',
    guardrail: 'Approval does not send delivery, generate public links, mark delivered, or complete the job.',
  };
}

export function sanitizeRevisionText(text: string) {
  return text.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 4000);
}
