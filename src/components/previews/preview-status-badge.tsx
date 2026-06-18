import { Badge, type BadgeTone } from '@/components/ui/badge';
import type { PreviewReviewStatus } from '@/domain/preview-gallery';

const toneByStatus: Record<PreviewReviewStatus, BadgeTone> = {
  READY_FOR_REVIEW: 'blue',
  APPROVED: 'green',
  FLAGGED: 'amber',
  FAILED: 'red',
  REJECTED: 'red',
};

export function PreviewStatusBadge({ status }: { status: PreviewReviewStatus }) {
  return <Badge tone={toneByStatus[status]}>{status.replaceAll('_', ' ').toLowerCase()}</Badge>;
}
