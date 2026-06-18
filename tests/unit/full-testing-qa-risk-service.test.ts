import { describe, expect, it } from 'vitest';
import { getQaProductionBlockers, summarizeQaRisks } from '@/server/services/full-testing-qa-risk-service';

describe('full testing QA risk service', () => {
  it('keeps production blocked until runtime verification exists', () => {
    const blockers = getQaProductionBlockers('HIGH');
    expect(blockers.length).toBeGreaterThan(0);
    expect(blockers.every((blocker) => blocker.productionReleaseAllowed === false)).toBe(true);
    expect(blockers.some((blocker) => blocker.key === 'no-fake-results')).toBe(true);
  });

  it('summarizes blocker counts', () => {
    const summary = summarizeQaRisks();
    expect(summary.productionReleaseAllowed).toBe(false);
    expect(summary.blockerCount).toBeGreaterThan(0);
  });
});
