import { JOB_STATUSES, type JobStatus } from '@/domain/job-status';

export const JOB_QUEUE_PHASE = 9 as const;

export const JOB_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;
export type JobPriority = (typeof JOB_PRIORITIES)[number];

export const DEADLINE_WARNING_LEVELS = ['NONE', 'UPCOMING', 'DUE_SOON', 'OVERDUE', 'BLOCKED'] as const;
export type DeadlineWarningLevel = (typeof DEADLINE_WARNING_LEVELS)[number];

export const JOB_QUEUE_SORT_FIELDS = ['deadline', 'createdAt', 'priority', 'status', 'source', 'revenue'] as const;
export type JobQueueSortField = (typeof JOB_QUEUE_SORT_FIELDS)[number];

export const JOB_QUEUE_FILTER_KEYS = ['status', 'sourceChannelName', 'deadline', 'priority', 'paymentStatus', 'uploadStatus', 'fulfillmentStatus', 'clientId'] as const;

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: 'Draft',
  WAITING_FOR_UPLOAD: 'Waiting for upload',
  UPLOAD_RECEIVED: 'Upload received',
  PROCESSING_QUEUED: 'Processing queued',
  PROCESSING: 'Processing',
  WAITING_FOR_REVIEW: 'Waiting for review',
  FLAGGED_OUTPUTS: 'Flagged outputs',
  APPROVED: 'Approved',
  REVISION_REQUESTED: 'Revision requested',
  REPROCESSING: 'Reprocessing',
  READY_FOR_DELIVERY: 'Ready for delivery',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed',
};

export const ACTIVE_QUEUE_STATUSES: JobStatus[] = [
  'WAITING_FOR_UPLOAD',
  'UPLOAD_RECEIVED',
  'PROCESSING_QUEUED',
  'PROCESSING',
  'WAITING_FOR_REVIEW',
  'FLAGGED_OUTPUTS',
  'REVISION_REQUESTED',
  'REPROCESSING',
  'READY_FOR_DELIVERY',
];

export const TERMINAL_JOB_STATUSES: JobStatus[] = ['DELIVERED', 'COMPLETED', 'CANCELLED', 'FAILED'];

export const JOB_PRIORITY_WEIGHTS: Record<JobPriority, number> = {
  LOW: 10,
  NORMAL: 20,
  HIGH: 30,
  URGENT: 40,
};

export type DeadlineInput = {
  deadline?: Date | string | null;
  now?: Date | string;
  status?: JobStatus;
};

export type QueueRankInput = {
  priority?: JobPriority | null;
  deadline?: Date | string | null;
  createdAt?: Date | string | null;
  status?: JobStatus;
  queuePosition?: number | null;
};

export function parseQueueDate(value?: Date | string | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getDeadlineWarningLevel(input: DeadlineInput): DeadlineWarningLevel {
  if (input.status && TERMINAL_JOB_STATUSES.includes(input.status)) return 'NONE';

  const deadline = parseQueueDate(input.deadline);
  if (!deadline) return 'NONE';

  const now = parseQueueDate(input.now) ?? new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) return 'OVERDUE';
  if (diffHours <= 24) return 'DUE_SOON';
  if (diffHours <= 72) return 'UPCOMING';
  return 'NONE';
}

export function isActiveQueueStatus(status: JobStatus): boolean {
  return ACTIVE_QUEUE_STATUSES.includes(status);
}

export function normalizeJobPriority(priority?: string | null): JobPriority {
  if (!priority) return 'NORMAL';
  const upper = priority.toUpperCase();
  return (JOB_PRIORITIES as readonly string[]).includes(upper) ? (upper as JobPriority) : 'NORMAL';
}

export function assertKnownJobStatus(status: string): asserts status is JobStatus {
  if (!(JOB_STATUSES as readonly string[]).includes(status)) {
    throw new Error(`Unknown job status: ${status}`);
  }
}

export function calculateQueueRank(input: QueueRankInput): number {
  if (typeof input.queuePosition === 'number' && input.queuePosition > 0) return input.queuePosition;

  const priority = normalizeJobPriority(input.priority);
  const deadline = parseQueueDate(input.deadline);
  const createdAt = parseQueueDate(input.createdAt) ?? new Date(0);
  const deadlinePenalty = deadline ? Math.max(0, Math.floor((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60))) : 9999;
  const activeBoost = input.status && isActiveQueueStatus(input.status) ? 0 : 5000;

  return activeBoost + deadlinePenalty - JOB_PRIORITY_WEIGHTS[priority];
}

export function buildJobNumber(input: { prefix?: string; sequence: number; createdAt?: Date | string }): string {
  const date = parseQueueDate(input.createdAt) ?? new Date();
  const stamp = `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  return `${input.prefix ?? 'LL'}-${stamp}-${String(input.sequence).padStart(5, '0')}`;
}

export function safeAdminQueueNote(note?: string | null): string | null {
  if (!note) return null;
  return note
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/(sk_live_[a-zA-Z0-9]+|rk_live_[a-zA-Z0-9]+|api[_-]?key\s*[:=]\s*\S+)/gi, '[redacted]')
    .slice(0, 5000)
    .trim() || null;
}
