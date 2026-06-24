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
const { buildQaEvidenceRetentionState, QA_EVIDENCE_RETENTION_POLICY } = await import(
  '@/server/services/full-testing-qa-verification-ledger-service'
);
const { QA_EVIDENCE_STORAGE_POLICY } = await import(
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

  it('adds a local retention policy to persisted ledger drafts', async () => {
    const draft = await buildQaVerificationLedgerDraft({
      organizationId: 'org_qa',
      packageVersion: 'v40',
      phase: 38,
      checkKey: 'build',
      layer: 'BUILD',
      status: 'PASS',
      severity: 'BLOCKER',
      command: 'npm run build',
      evidence: [{ type: 'COMMAND_OUTPUT', ref: 'ROADMAP_STATUS.md#build' }],
      notes: 'build passed with local evidence',
    });

    expect(draft.accepted).toBe(true);
    expect(draft.retentionPolicy.policyKey).toBe(QA_EVIDENCE_RETENTION_POLICY.policyKey);
    expect(draft.storagePolicy.policyKey).toBe(QA_EVIDENCE_STORAGE_POLICY.policyKey);
    expect(draft.storagePolicy.mode).toBe('LOCAL_DATABASE_REFERENCES');
    expect(draft.storagePolicy.productionDecision).toContain('not required for local Phase 38 verification');
    expect(draft.retentionPolicy.purgeAction).toBe('manual_admin_purge_required');
    expect(draft.retentionPolicy.externalArtifactStorageRequired).toBe(false);
    expect(draft.storagePolicy.externalArtifactStorageRequired).toBe(false);
    expect(draft.storagePolicy.forbiddenMaterial).toContain('rawSecret');
  });

  it('marks old evidence references as purge eligible after the retention window', () => {
    const state = buildQaEvidenceRetentionState(
      { createdAt: new Date('2026-01-01T00:00:00.000Z'), evidenceCount: 1 },
      new Date('2026-07-01T00:00:00.000Z')
    );

    expect(state.hasEvidence).toBe(true);
    expect(state.purgeEligible).toBe(true);
    expect(state.deleteAfter.toISOString()).toBe('2026-06-30T00:00:00.000Z');
  });
});
