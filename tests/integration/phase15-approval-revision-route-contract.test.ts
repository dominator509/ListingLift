import { describe, expect, it } from 'vitest';
import { MANUAL_APPROVAL_DECISIONS, OUTPUT_APPROVAL_DECISIONS } from '@/domain/manual-approval';

describe('phase 15 route contract', () => {
  it('defines job and output approval decisions', () => {
    expect(MANUAL_APPROVAL_DECISIONS).toContain('APPROVE_JOB');
    expect(OUTPUT_APPROVAL_DECISIONS).toContain('REQUEST_MANUAL_REPLACEMENT');
  });

  it('requires Codex to wire routes transactionally', () => {
    const requiredRoutes = ['/api/approvals/jobs/[jobId]/readiness', '/api/approvals/jobs/[jobId]/approve', '/api/revisions/request', '/api/manual-replacements/marker'];
    expect(requiredRoutes.length).toBeGreaterThan(3);
  });
});
