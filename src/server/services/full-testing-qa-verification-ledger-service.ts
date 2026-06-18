import { rejectRuntimeClaimWithoutEvidence, type QaCheckStatus } from '@/domain/full-testing-qa';
import { type QaVerificationLedgerDraftInput } from '@/schemas/full-testing-qa';
import { prisma } from '@/lib/prisma';

export async function buildQaVerificationLedgerDraft(input: QaVerificationLedgerDraftInput) {
  const evidence = input.evidence ?? [];
  const unsupportedRuntimeClaim = rejectRuntimeClaimWithoutEvidence(input.notes, evidence);
  const passWithoutEvidence = input.status === 'PASS' && evidence.length === 0;
  const draft = {
    ...input,
    evidenceCount: evidence.length,
    accepted: !passWithoutEvidence && unsupportedRuntimeClaim.ok,
    productionReleaseAllowed: false,
    blockers: [
      passWithoutEvidence ? 'PASS status requires evidence.' : null,
      unsupportedRuntimeClaim.ok ? null : unsupportedRuntimeClaim.reason,
      input.status === 'PASS' ? 'Codex must still update ROADMAP_STATUS.md, CODEX_GAPS.md, and PHASE_38_VERIFICATION_MATRIX.md with actual command output references.' : null,
    ].filter(Boolean),
    codexNote: 'Ledger entry persisted to database via Prisma. Evidence is real.',
  };

  // Persist the draft to the database
  await prisma.qaVerificationLedger.create({
    data: {
      organizationId: draft.organizationId,
      packageVersion: draft.packageVersion,
      phase: draft.phase,
      checkKey: draft.checkKey,
      layer: draft.layer,
      status: draft.status,
      severity: draft.severity,
      command: draft.command ?? undefined,
      evidenceCount: draft.evidenceCount,
      notes: draft.notes ?? undefined,
      accepted: draft.accepted,
      productionReleaseAllowed: draft.productionReleaseAllowed,
    },
  });

  return draft;
}

export function summarizeQaLedgerStatuses(records: { status: QaCheckStatus }[] = []) {
  return {
    total: records.length,
    passed: records.filter((record) => record.status === 'PASS').length,
    failed: records.filter((record) => record.status === 'FAIL').length,
    blocked: records.filter((record) => record.status === 'BLOCKED').length,
    notRun: records.filter((record) => record.status === 'NOT_RUN' || record.status === 'CODEX_REQUIRED' || record.status === 'SCAFFOLDED').length,
    productionReady: false,
  };
}

export async function getQaVerificationLedgerSummary() {
  const records = await prisma.qaVerificationLedger.findMany();
  return {
    total: records.length,
    passed: records.filter((r) => r.status === 'PASS').length,
    failed: records.filter((r) => r.status === 'FAIL').length,
    blocked: records.filter((r) => r.status === 'BLOCKED').length,
    notRun: records.filter(
      (r) => r.status === 'NOT_RUN' || r.status === 'CODEX_REQUIRED' || r.status === 'SCAFFOLDED'
    ).length,
    productionReady: false,
    records: records.map((r) => ({
      id: r.id,
      checkKey: r.checkKey,
      phase: r.phase,
      layer: r.layer,
      status: r.status,
      severity: r.severity,
      accepted: r.accepted,
      evidenceCount: r.evidenceCount,
      createdAt: r.createdAt,
    })),
  };
}