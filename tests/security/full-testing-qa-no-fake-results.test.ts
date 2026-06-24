import { beforeEach, describe, expect, it, vi } from 'vitest';
import { rejectRuntimeClaimWithoutEvidence } from '@/domain/full-testing-qa';

const auditLogCreate = vi.hoisted(() => vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mock-audit-log-id', ...data })));
const qaLedgerCreate = vi.hoisted(() => vi.fn().mockResolvedValue({ id: 'mock-ledger-id' }));

// Mock Prisma so the service can run without a real database connection
vi.mock('@/lib/prisma', () => ({
  prisma: {
    auditLog: {
      create: auditLogCreate,
    },
    qaVerificationLedger: {
      create: qaLedgerCreate,
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
const { recordQaLedgerAuditEvent } = await import(
  '@/server/services/full-testing-qa-verification-ledger-service'
);

describe('Phase 38 no fake QA results', () => {
  beforeEach(() => {
    auditLogCreate.mockClear();
    qaLedgerCreate.mockClear();
  });

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
    expect(draft.auditPolicy.requiredActions).toContain('qa.ledger.evidence_deleted');
    expect(draft.auditPolicy.requiredActions).toContain('qa.ledger.manual_override');
    expect(draft.auditActions).toEqual([
      'qa.ledger.entry_created',
      'qa.ledger.status_changed',
      'qa.ledger.evidence_created',
    ]);
    expect(auditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'qa.ledger.evidence_created',
          targetType: 'qa_verification_ledger',
          targetId: 'mock-ledger-id',
          metadata: expect.objectContaining({
            ledgerId: 'mock-ledger-id',
            rawEvidenceStored: false,
            evidenceCount: 1,
          }),
        }),
      })
    );
    expect(JSON.stringify(auditLogCreate.mock.calls)).not.toContain('rawSecret');
  });

  it('supports sanitized QA deletion and manual override audit events', async () => {
    await recordQaLedgerAuditEvent({
      organizationId: 'org_qa',
      actorUserId: 'user_qa',
      ledgerId: 'ledger_qa',
      action: 'qa.ledger.evidence_deleted',
      metadata: { checkKey: 'build', evidenceCount: 0, rawToken: 'll_secret_token' },
    });
    await recordQaLedgerAuditEvent({
      organizationId: 'org_qa',
      actorUserId: 'user_qa',
      ledgerId: 'ledger_qa',
      action: 'qa.ledger.manual_override',
      metadata: { checkKey: 'build', reason: 'Operator corrected stale evidence ref.', rawSecret: 'super-secret' },
    });

    expect(auditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'qa.ledger.evidence_deleted',
          metadata: expect.objectContaining({ rawToken: '[redacted]' }),
        }),
      })
    );
    expect(auditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'qa.ledger.manual_override',
          metadata: expect.objectContaining({ rawSecret: '[redacted]' }),
        }),
      })
    );
    expect(JSON.stringify(auditLogCreate.mock.calls)).not.toContain('ll_secret_token');
    expect(JSON.stringify(auditLogCreate.mock.calls)).not.toContain('super-secret');
  });

  it('redacts sensitive values from persisted QA evidence references and notes', async () => {
    const draft = await buildQaVerificationLedgerDraft({
      organizationId: 'org_qa',
      packageVersion: 'v40',
      phase: 38,
      checkKey: 'e2e',
      layer: 'E2E',
      status: 'PASS',
      severity: 'BLOCKER',
      command: 'npm run test:e2e',
      evidence: [
        {
          type: 'TRACE',
          ref: 'https://storage.example/trace.zip?token=raw-token-123&signature=raw-signature-456',
          note: 'authorization: Bearer secret-token password=plain-text apiKey=provider-key',
        },
      ],
      notes: 'e2e passed with redacted local evidence',
    });

    const serializedDraft = JSON.stringify(draft.evidenceRefs);
    const persistedData = JSON.stringify(qaLedgerCreate.mock.calls.at(-1)?.[0]?.data?.evidenceRefs);

    expect(serializedDraft).toContain('token=[redacted]');
    expect(serializedDraft).toContain('signature=[redacted]');
    expect(serializedDraft).toContain('authorization:[redacted]');
    expect(serializedDraft).toContain('password=[redacted]');
    expect(serializedDraft).toContain('apiKey=[redacted]');
    expect(serializedDraft).not.toContain('raw-token-123');
    expect(serializedDraft).not.toContain('raw-signature-456');
    expect(serializedDraft).not.toContain('secret-token');
    expect(serializedDraft).not.toContain('plain-text');
    expect(serializedDraft).not.toContain('provider-key');
    expect(persistedData).toBe(serializedDraft);
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
