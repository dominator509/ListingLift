import { describe, expect, it } from 'vitest';
import { assertPreviewItemStillAdminOnlyWhenFlagged, canExposeQualityReviewToClient } from '@/server/services/quality-control-access-service';

describe('quality control client visibility', () => {
  it('does not expose flagged QC reviews to clients', () => {
    expect(canExposeQualityReviewToClient({ approvedStatus: 'PENDING', reviewStatus: 'FLAGGED', visibility: 'ADMIN_ONLY' })).toBe(false);
    expect(canExposeQualityReviewToClient({ approvedStatus: 'APPROVED', reviewStatus: 'PASSED', visibility: 'CLIENT_VISIBLE' })).toBe(true);
  });

  it('throws if a flagged preview item is marked client-visible', () => {
    expect(() => assertPreviewItemStillAdminOnlyWhenFlagged({
      id: 'item',
      outputFileName: 'item.jpg',
      outputType: 'WHITE_JPG',
      status: 'FLAGGED',
      reviewStatus: 'FLAGGED',
      visibility: 'CLIENT_VISIBLE',
      clientVisible: true,
      needsAdminReview: true,
      flags: ['wrong_crop'],
      safeClaim: 'Preview only.',
    })).toThrow(/must not be client-visible/);
  });
});
