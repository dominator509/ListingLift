import { describe, expect, it } from 'vitest';
import { assignQualityBand, calculateOutputQualityScore, scoreQualityOutput } from '@/server/services/quality-score-service';

describe('quality score service', () => {
  it('applies penalties for warning and blocker flags', () => {
    expect(calculateOutputQualityScore({ qualityScore: 90, flags: ['edge_quality_issue'] })).toBeLessThan(90);
    expect(calculateOutputQualityScore({ qualityScore: 90, flags: ['failed_mask'] })).toBeLessThan(60);
  });

  it('assigns quality bands', () => {
    expect(assignQualityBand(96)).toBe('EXCELLENT');
    expect(assignQualityBand(82)).toBe('GOOD');
    expect(assignQualityBand(70)).toBe('REVIEW');
    expect(assignQualityBand(50)).toBe('BLOCKED');
  });

  it('returns manual fallback requirements for failed masks', () => {
    const review = scoreQualityOutput({ id: 'out', outputFileName: 'out.png', qualityScore: 82, flags: ['failed_mask'] });
    expect(review.manualFallbackRequired).toBe(true);
  });
});
