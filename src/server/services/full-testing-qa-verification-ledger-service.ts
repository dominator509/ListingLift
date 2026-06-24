import { rejectRuntimeClaimWithoutEvidence, type QaCheckStatus } from '@/domain/full-testing-qa';
import { type QaVerificationLedgerDraftInput } from '@/schemas/full-testing-qa';
import { prisma } from '@/lib/prisma';

function toEvidenceRefs(input: QaVerificationLedgerDraftInput['evidence']) {
  return (input ?? []).map((evidence) => ({
    type: evidence.type,
    ref: evidence.ref,
    ...(evidence.note ? { note: evidence.note } : {}),
  }));
}

export async function buildQaVerificationLedgerDraft(input: QaVerificationLedgerDraftInput) {
  const evidence = input.evidence ?? [];
  const evidenceRefs = toEvidenceRefs(evidence);
  const unsupportedRuntimeClaim = rejectRuntimeClaimWithoutEvidence(input.notes, evidence);
  const passWithoutEvidence = input.status === 'PASS' && evidence.length === 0;
  const draft = {
    ...input,
    evidenceCount: evidence.length,
    evidenceRefs,
    accepted: !passWithoutEvidence && unsupportedRuntimeClaim.ok,
    productionReleaseAllowed: false,
    blockers: [
      passWithoutEvidence ? 'PASS status requires evidence.' : null,
      unsupportedRuntimeClaim.ok ? null : unsupportedRuntimeClaim.reason,
      input.status === 'PASS' ? 'Codex must still update ROADMAP_STATUS.md, CODEX_GAPS.md, and PHASE_38_VERIFICATION_MATRIX.md with actual command output references.' : null,
    ].filter(Boolean),
    codexNote: 'Ledger entry persisted to database via Prisma. Evidence references are stored for audit review.',
  };

  const record = await prisma.qaVerificationLedger.create({
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
      evidenceRefs: draft.evidenceRefs,
      notes: draft.notes ?? undefined,
      accepted: draft.accepted,
      productionReleaseAllowed: draft.productionReleaseAllowed,
    },
  });

  return { ...draft, id: record.id, persisted: true };
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

export async function getQaVerificationLedgerSummary(organizationId?: string) {
  const records = await prisma.qaVerificationLedger.findMany({
    where: organizationId ? { organizationId } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
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
      evidenceRefs: r.evidenceRefs,
      productionReleaseAllowed: r.productionReleaseAllowed,
      createdAt: r.createdAt,
    })),
  };
}
