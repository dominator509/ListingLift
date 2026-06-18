import type { QualityOutputInput } from '@/domain/quality-control';
import { buildJobQualityReview } from '@/server/services/quality-review-service';
import { FlaggedOutputTable } from './flagged-output-table';
import { ManualReplacementPanel } from './manual-replacement-panel';
import { OutputReviewPanel } from './output-review-panel';
import { QualityChecklistPanel } from './quality-checklist-panel';
import { QualityScoreMeter } from './quality-score-meter';
import { QualitySummaryCards } from './quality-summary-cards';

export function QualityControlBoard({ jobId, outputs }: { jobId: string; outputs: QualityOutputInput[] }) {
  const review = buildJobQualityReview({ organizationId: 'demo-org', jobId, outputs });
  const flagged = review.reviews.filter((item) => item.finalDeliveryBlocked);
  const first = review.reviews[0];
  return (
    <div className="space-y-8">
      <QualitySummaryCards summary={review.summary} />
      {first ? <QualityScoreMeter score={first.score} /> : null}
      {first ? <OutputReviewPanel review={first} /> : null}
      <FlaggedOutputTable items={flagged} />
      <ManualReplacementPanel />
      <QualityChecklistPanel />
    </div>
  );
}
