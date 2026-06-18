import { STATUS_TRANSITION_REQUIRES_NOTE, type JobStatus } from '@/domain/job-status';
import { assertCanTransitionJob } from '@/server/services/job-lifecycle-service';
import type { JobStatusTransitionInput } from '@/schemas/job';

export type JobTransitionDraft = {
  fromStatus: JobStatus;
  toStatus: JobStatus;
  note: string | null;
  manualOverride: boolean;
  changedAt: string;
  auditAction: 'job_status_changed' | 'job_status_manual_override';
};

export function buildJobTransitionDraft(input: { currentStatus: JobStatus; transition: JobStatusTransitionInput; now?: Date | string }): JobTransitionDraft {
  const { currentStatus, transition } = input;
  if (!transition.manualOverride) {
    assertCanTransitionJob(currentStatus, transition.nextStatus);
  }
  if (STATUS_TRANSITION_REQUIRES_NOTE.includes(transition.nextStatus) && !transition.note && !transition.reason) {
    throw new Error(`A note or reason is required when moving a job to ${transition.nextStatus}.`);
  }
  return {
    fromStatus: currentStatus,
    toStatus: transition.nextStatus,
    note: transition.note ?? transition.reason ?? null,
    manualOverride: transition.manualOverride,
    changedAt: new Date(input.now ?? new Date()).toISOString(),
    auditAction: transition.manualOverride ? 'job_status_manual_override' : 'job_status_changed',
  };
}

export function assertStatusTransitionCanExposeDelivery(input: { nextStatus: JobStatus; approvedAt?: Date | string | null }) {
  if (['READY_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(input.nextStatus) && !input.approvedAt) {
    throw new Error('Admin approval is required before a job can move into delivery-visible statuses.');
  }
}
