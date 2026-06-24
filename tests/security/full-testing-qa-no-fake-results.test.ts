import { describe, expect, it, vi } from 'vitest';
import { rejectRuntimeClaimWithoutEvidence } from '@/domain/full-testing-qa';

// Mock Prisma so the service can run without a real database connection
vi.mock('@/lib/prisma', () => ({
  prisma: {
    qaVerificationLedger: {
      create: vi.fn().mockResolvedValue({ id: 'mock-ledger-id' }),
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

const { buildQaVerificationLedgerDraft } = await import(
  '@/server/services/full-testing-qa-verification-ledger-service'
);

describe('Phase 38 no fake QA results', () => {
  it('blocks PASS status without evidence', async () => {
    const draft = await buildQaVerificationLedgerDraft({
      organizationId: 'org_qa',
      packageVersion: 'v40',
      phase: 38,
      checkKey: 'typecheck',
      layer: 'TYPECHECK',
      status: 'PASS',
      severity: 'BLOCKER',
      command: 'npm run typecheck',
      evidence: [],
      notes: 'typecheck passed',
    });
    expect(draft.accepted).toBe(false);
    expect(draft.blockers.join(' ')).toContain('PASS status requires evidence');
  });

  it('allows scaffold notes that do not claim runtime success', () => {
    expect(rejectRuntimeClaimWithoutEvidence('Added a route contract and documented Codex gaps.', []).ok).toBe(true);
  });
});
