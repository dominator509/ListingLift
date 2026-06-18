import { JOB_STATUSES, type JobStatus } from '@/domain/job-status';
import { assertValidJobStatus as assertKnownStatus } from '@/server/services/job-lifecycle-service';
import { assertCanTransitionJob } from '@/server/services/job-lifecycle-service';
import { getDeadlineWarningLevel, normalizeJobPriority, type JobPriority } from '@/domain/job-queue';

export type JobSummary = {
  id: string;
  organizationId: string;
  clientId?: string | null;
  title: string;
  status: JobStatus;
  priority?: JobPriority | string | null;
  deadline?: Date | string | null;
  approvedAt?: Date | string | null;
};

export function assertValidJobStatus(status: JobStatus | string) {
  if (!JOB_STATUSES.includes(status as JobStatus)) throw new Error(`Invalid job status: ${status}`);
}

export function transitionJob(job: JobSummary, nextStatus: JobStatus) {
  assertCanTransitionJob(job.status, nextStatus);
  return { ...job, status: nextStatus };
}

export function summarizeJobForQueue(job: JobSummary, now?: Date | string) {
  return {
    ...job,
    priority: normalizeJobPriority(job.priority),
    deadlineWarningLevel: getDeadlineWarningLevel({ deadline: job.deadline, status: job.status, now }),
  };
}

export function requireApprovedBeforeDelivery(job: { status: JobStatus; approvedAt?: Date | string | null }) {
  if (!['READY_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(job.status)) {
    throw new Error('Job is not ready for delivery.');
  }
  if (!job.approvedAt) throw new Error('Admin approval is required before delivery.');
}

export { assertKnownStatus };
