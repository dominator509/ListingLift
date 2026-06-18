import { describe, expect, it } from 'vitest';
import { QA_COMMAND_PLAN, QA_ROADMAP_COVERAGE, rejectRuntimeClaimWithoutEvidence, summarizeQaCommands } from '@/domain/full-testing-qa';

describe('full testing QA domain', () => {
  it('requires Codex evidence for all production-blocking QA commands', () => {
    expect(QA_COMMAND_PLAN.length).toBeGreaterThanOrEqual(15);
    expect(QA_COMMAND_PLAN.every((command) => command.codexRequired)).toBe(true);
    expect(QA_COMMAND_PLAN.every((command) => command.blocksProduction)).toBe(true);
    expect(QA_COMMAND_PLAN.some((command) => command.command === 'npm run test:e2e')).toBe(true);
  });

  it('maps roadmap coverage across core test layers', () => {
    const layers = new Set(QA_ROADMAP_COVERAGE.map((item) => item.layer));
    expect(layers.has('UNIT')).toBe(true);
    expect(layers.has('INTEGRATION')).toBe(true);
    expect(layers.has('E2E')).toBe(true);
    expect(layers.has('BROWSER')).toBe(true);
  });

  it('does not allow runtime claims without evidence', () => {
    expect(rejectRuntimeClaimWithoutEvidence('npm install passed', []).ok).toBe(false);
    expect(rejectRuntimeClaimWithoutEvidence('Scaffolded QA plan only', []).ok).toBe(true);
    expect(rejectRuntimeClaimWithoutEvidence('npm install passed', [{ type: 'COMMAND_OUTPUT' }]).ok).toBe(true);
  });

  it('summarizes QA commands as not production-ready', () => {
    const summary = summarizeQaCommands();
    expect(summary.canClaimProductionReady).toBe(false);
    expect(summary.codexRequired).toBe(summary.commandCount);
  });
});
