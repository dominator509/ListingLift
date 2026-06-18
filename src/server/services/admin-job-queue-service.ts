import { calculateQueueRank, getDeadlineWarningLevel, normalizeJobPriority, safeAdminQueueNote, type JobPriority } from '@/domain/job-queue';
import type { JobStatus } from '@/domain/job-status';
import type { AdminJobQueueFilter, JobQueueItem } from '@/schemas/job';

export type JobQueueSource = {
  id: string;
  jobNumber?: string | null;
  title: string;
  clientName?: string | null;
  packageKey?: string | null;
  sourceChannelName?: string | null;
  status: JobStatus;
  priority?: JobPriority | string | null;
  deadline?: Date | string | null;
  imageQuantity?: number | null;
  paymentStatus?: string | null;
  uploadStatus?: string | null;
  fulfillmentStatus?: string | null;
  revenueAttribution?: unknown;
  createdAt?: Date | string | null;
  queuePosition?: number | null;
};

export function toJobQueueItem(job: JobQueueSource, now?: Date | string): JobQueueItem {
  const priority = normalizeJobPriority(job.priority);
  const deadline = job.deadline ? new Date(job.deadline).toISOString() : null;
  const warningLevel = getDeadlineWarningLevel({ deadline: job.deadline, now, status: job.status });
  return {
    id: job.id,
    jobNumber: job.jobNumber ?? null,
    title: job.title,
    clientName: job.clientName ?? null,
    packageKey: job.packageKey ?? null,
    sourceChannelName: job.sourceChannelName ?? null,
    status: job.status,
    priority,
    deadline,
    deadlineWarningLevel: warningLevel,
    imageQuantity: job.imageQuantity ?? 0,
    paymentStatus: job.paymentStatus ?? undefined,
    uploadStatus: job.uploadStatus ?? undefined,
    fulfillmentStatus: job.fulfillmentStatus ?? undefined,
    revenueAttribution: job.revenueAttribution,
    queueRank: calculateQueueRank({ priority, deadline: job.deadline, createdAt: job.createdAt, status: job.status, queuePosition: job.queuePosition }),
  };
}

export function filterJobQueue(items: JobQueueItem[], filters: Partial<AdminJobQueueFilter>): JobQueueItem[] {
  return items.filter((item) => {
    if (filters.status?.length && !filters.status.includes(item.status)) return false;
    if (filters.priority?.length && !filters.priority.includes(item.priority)) return false;
    if (filters.sourceChannelName?.length && (!item.sourceChannelName || !filters.sourceChannelName.includes(item.sourceChannelName))) return false;
    if (filters.deadlineWarningLevel?.length && !filters.deadlineWarningLevel.includes(item.deadlineWarningLevel)) return false;
    if (filters.search) {
      const haystack = [item.title, item.jobNumber, item.clientName, item.sourceChannelName, item.packageKey].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(filters.search.toLowerCase())) return false;
    }
    return true;
  });
}

export function sortJobQueue(items: JobQueueItem[], sortBy: AdminJobQueueFilter['sortBy'] = 'deadline', direction: AdminJobQueueFilter['sortDirection'] = 'asc'): JobQueueItem[] {
  const factor = direction === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const aValue = sortValue(a, sortBy);
    const bValue = sortValue(b, sortBy);
    if (aValue < bValue) return -1 * factor;
    if (aValue > bValue) return 1 * factor;
    return (a.queueRank ?? 0) - (b.queueRank ?? 0);
  });
}

function sortValue(item: JobQueueItem, sortBy: AdminJobQueueFilter['sortBy']): string | number {
  switch (sortBy) {
    case 'priority': return item.priority;
    case 'status': return item.status;
    case 'source': return item.sourceChannelName ?? '';
    case 'revenue': return typeof item.revenueAttribution === 'object' && item.revenueAttribution ? JSON.stringify(item.revenueAttribution) : '';
    case 'createdAt': return item.id;
    case 'deadline':
    default: return item.deadline ?? '9999-12-31T23:59:59.999Z';
  }
}

export function summarizeAdminQueue(items: JobQueueItem[]) {
  return {
    total: items.length,
    overdue: items.filter((item) => item.deadlineWarningLevel === 'OVERDUE').length,
    dueSoon: items.filter((item) => item.deadlineWarningLevel === 'DUE_SOON').length,
    waitingForUpload: items.filter((item) => item.status === 'WAITING_FOR_UPLOAD').length,
    waitingForReview: items.filter((item) => item.status === 'WAITING_FOR_REVIEW' || item.status === 'FLAGGED_OUTPUTS').length,
    readyForDelivery: items.filter((item) => item.status === 'READY_FOR_DELIVERY').length,
  };
}

export function sanitizeJobAdminNote(note?: string | null): string | null {
  return safeAdminQueueNote(note);
}
