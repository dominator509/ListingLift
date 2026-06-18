export const JOB_STATUSES = [
  'DRAFT',
  'WAITING_FOR_UPLOAD',
  'UPLOAD_RECEIVED',
  'PROCESSING_QUEUED',
  'PROCESSING',
  'WAITING_FOR_REVIEW',
  'FLAGGED_OUTPUTS',
  'APPROVED',
  'REVISION_REQUESTED',
  'REPROCESSING',
  'READY_FOR_DELIVERY',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'FAILED',
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const DELIVERY_VISIBLE_STATUSES: JobStatus[] = ['READY_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'];

export function canExposeDelivery(status: JobStatus, approvedAt?: Date | string | null) {
  return Boolean(approvedAt) && DELIVERY_VISIBLE_STATUSES.includes(status);
}


export const STATUS_TRANSITION_REQUIRES_NOTE: JobStatus[] = ['CANCELLED', 'FAILED', 'REVISION_REQUESTED'];

export function isTerminalJobStatus(status: JobStatus) {
  return ['DELIVERED', 'COMPLETED', 'CANCELLED', 'FAILED'].includes(status);
}

export function isClientVisibleJobStatus(status: JobStatus) {
  return !['DRAFT', 'PROCESSING_QUEUED'].includes(status);
}
