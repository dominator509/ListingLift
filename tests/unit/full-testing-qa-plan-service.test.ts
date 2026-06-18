import { describe, expect, it } from 'vitest';
import { buildFullTestingQaPlan, buildQaCommandSequence, buildQaCoverageMatrix } from '@/server/services/full-testing-qa-plan-service';

describe('full testing QA plan service', () => {
  it('builds an ordered command sequence with runtime-required statuses', () => {
    const sequence = buildQaCommandSequence();
    expect(sequence[0].command).toBe('npm run verify-env');
    expect(sequence.every((step) => step.status === 'CODEX_REQUIRED')).toBe(true);
    expect(sequence.some((step) => step.command === 'npm run build')).toBe(true);
  });

  it('filters coverage by layer', () => {
    const unitCoverage = buildQaCoverageMatrix('UNIT');
    expect(unitCoverage.length).toBeGreaterThan(0);
    expect(unitCoverage.every((item) => item.layer === 'UNIT')).toBe(true);
  });

  it('builds the full QA plan without claiming production readiness', () => {
    const plan = buildFullTestingQaPlan();
    expect(plan.phase).toBe(38);
    expect(plan.productionReady).toBe(false);
    expect(plan.codexNote).toContain('Codex must run commands');
  });
});
