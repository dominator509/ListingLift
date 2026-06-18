import { describe, expect, it } from 'vitest';
import { evaluateOutputQuality } from '@/domain/quality-control';

describe('quality control delivery gate', () => {
  it('blocks final delivery for failed masks and missing product parts', () => {
    const review = evaluateOutputQuality({ id: 'pf', outputFileName: 'pf.png', flags: ['failed_mask', 'missing_part'], status: 'FLAGGED' });
    expect(review.finalDeliveryBlocked).toBe(true);
    expect(review.manualReplacementRequired).toBe(true);
  });

  it('does not convert QC pass into final delivery approval', () => {
    const review = evaluateOutputQuality({ id: 'pf', outputFileName: 'pf.jpg', qualityScore: 98, flags: [], status: 'APPROVED', approvedStatus: 'APPROVED' });
    expect(review.status).toBe('PASSED');
    expect(review.safeLanguage).toMatch(/No marketplace approval/);
  });
});
