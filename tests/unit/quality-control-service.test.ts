import { describe, expect, it } from 'vitest';
import { evaluateOutputQuality, summarizeQualityReviews } from '@/domain/quality-control';
import { buildJobQualityReview } from '@/server/services/quality-review-service';

const outputs = [
  { id: 'ready', outputFileName: 'ready.jpg', qualityScore: 94, status: 'READY_FOR_REVIEW', approvedStatus: 'PENDING', flags: [] },
  { id: 'flagged', outputFileName: 'flagged.jpg', qualityScore: 78, status: 'FLAGGED', approvedStatus: 'PENDING', flags: ['edge_quality_issue', 'wrong_crop'] },
  { id: 'failed', outputFileName: 'failed.png', qualityScore: 60, status: 'FAILED', approvedStatus: 'PENDING', flags: ['failed_mask'] },
];

describe('Phase 14 quality control', () => {
  it('marks blocker flags as final-delivery blocking', () => {
    const review = evaluateOutputQuality(outputs[2]);
    expect(review.status).toBe('FAILED');
    expect(review.finalDeliveryBlocked).toBe(true);
    expect(review.manualReplacementRequired).toBe(true);
  });

  it('summarizes job-level QC state', () => {
    const review = buildJobQualityReview({ organizationId: 'org', jobId: 'job', outputs });
    expect(review.summary.total).toBe(3);
    expect(review.summary.deliveryBlocked).toBe(true);
    expect(review.summary.blockers).toBeGreaterThan(0);
  });

  it('keeps QC separate from final delivery approval', () => {
    const summary = summarizeQualityReviews(outputs.map(evaluateOutputQuality));
    expect(summary.deliveryBlocked).toBe(true);
  });
});
