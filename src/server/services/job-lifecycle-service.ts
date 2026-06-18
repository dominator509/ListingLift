import { JOB_STATUSES, canExposeDelivery, type JobStatus } from '@/domain/job-status';

const allowedTransitions: Record<JobStatus, JobStatus[]> = {
  DRAFT: ['WAITING_FOR_UPLOAD', 'CANCELLED'],
  WAITING_FOR_UPLOAD: ['UPLOAD_RECEIVED', 'CANCELLED'],
  UPLOAD_RECEIVED: ['PROCESSING_QUEUED', 'FAILED'],
  PROCESSING_QUEUED: ['PROCESSING', 'FAILED'],
  PROCESSING: ['WAITING_FOR_REVIEW', 'FLAGGED_OUTPUTS', 'FAILED'],
  WAITING_FOR_REVIEW: ['FLAGGED_OUTPUTS', 'APPROVED', 'REVISION_REQUESTED'],
  FLAGGED_OUTPUTS: ['REPROCESSING', 'APPROVED', 'FAILED'],
  APPROVED: ['READY_FOR_DELIVERY', 'REVISION_REQUESTED'],
  REVISION_REQUESTED: ['REPROCESSING', 'CANCELLED'],
  REPROCESSING: ['PROCESSING', 'WAITING_FOR_REVIEW', 'FAILED'],
  READY_FOR_DELIVERY: ['DELIVERED', 'REVISION_REQUESTED'],
  DELIVERED: ['COMPLETED', 'REVISION_REQUESTED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: ['REPROCESSING', 'CANCELLED'],
};

export function canTransitionJob(from: JobStatus, to: JobStatus) {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function assertCanTransitionJob(from: JobStatus, to: JobStatus) {
  if (!canTransitionJob(from, to)) throw new Error(`Invalid job transition: ${from} -> ${to}`);
}

export function assertDeliveryVisibility(status: JobStatus, approvedAt?: Date | string | null) {
  if (!canExposeDelivery(status, approvedAt)) {
    throw new Error('Delivery cannot be exposed before admin approval and delivery-ready status.');
  }
}


export function assertValidJobStatus(status: string): asserts status is JobStatus {
  if (!(JOB_STATUSES as readonly string[]).includes(status)) {
    throw new Error(`Invalid job status: ${status}`);
  }
}
