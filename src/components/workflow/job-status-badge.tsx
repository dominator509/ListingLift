import type { JobStatus } from '@/domain/job-status';
import { Badge, type BadgeTone } from '@/components/ui/badge';

const toneByStatus: Record<JobStatus, BadgeTone> = {
  DRAFT: 'slate',
  WAITING_FOR_UPLOAD: 'amber',
  UPLOAD_RECEIVED: 'blue',
  PROCESSING_QUEUED: 'blue',
  PROCESSING: 'blue',
  WAITING_FOR_REVIEW: 'amber',
  FLAGGED_OUTPUTS: 'red',
  APPROVED: 'green',
  REVISION_REQUESTED: 'amber',
  REPROCESSING: 'blue',
  READY_FOR_DELIVERY: 'green',
  DELIVERED: 'green',
  COMPLETED: 'green',
  CANCELLED: 'slate',
  FAILED: 'red',
};

export function formatStatus(status: string) {
  return status.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Badge tone={toneByStatus[status]}>{formatStatus(status)}</Badge>;
}
