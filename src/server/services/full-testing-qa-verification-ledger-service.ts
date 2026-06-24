import { rejectRuntimeClaimWithoutEvidence, type QaCheckStatus } from '@/domain/full-testing-qa';
import { type QaVerificationLedgerDraftInput } from '@/schemas/full-testing-qa';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/server/services/audit-log-service';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const QA_EVIDENCE_STORAGE_POLICY = {
  policyKey: 'phase38-local-qa-evidence-storage',
  mode: 'LOCAL_DATABASE_REFERENCES',
  externalArtifactStorageRequired: false,
  acceptedReferenceTypes: ['COMMAND_OUTPUT', 'SCREENSHOT', 'TRACE', 'LOG', 'DATABASE_RECORD', 'MANUAL_REVIEW_NOTE', 'ARTIFACT'],
  productionDecision: 'External artifact storage is not required for local Phase 38 verification. Revisit before production/CI evidence retention, cross-run trace retention, or deployment release gates.',
  forbiddenMaterial: ['rawSecret', 'rawToken', 'signedUrl', 'providerKey', 'rawWebhookPayload', 'customerPrivateNote', 'marketplaceCredential', 'marketplacePassword', 'rawFileBytes', 'unapprovedDeliveryLink'],
} as const;

export const QA_EVIDENCE_RETENTION_POLICY = {
  policyKey: 'phase38-local-qa-evidence-retention',
  evidenceReviewDays: 30,
  evidenceDeleteAfterDays: 180,
  commandLogDeleteAfterDays: 30,
  externalArtifactStorageRequired: QA_EVIDENCE_STORAGE_POLICY.externalArtifactStorageRequired,
  purgeAction: 'manual_admin_purge_required',
  note: 'Local QA evidence references are retained for review, then become eligible for manual purge. Raw secrets, raw tokens, signed URLs, raw file bytes, and unapproved delivery links must never be stored.',
} as const;

export const QA_LEDGER_AUDIT_POLICY = {
  policyKey: 'phase38-qa-ledger-audit-events',
  requiredActions: [
    'qa.ledger.entry_created',
    'qa.ledger.status_changed',
    'qa.ledger.evidence_created',
    'qa.ledger.evidence_deleted',
    'qa.ledger.manual_override',
  ],
  forbiddenMetadata: QA_EVIDENCE_STORAGE_POLICY.forbiddenMaterial,
  note: 'QA ledger mutations must be audited with organization scope, actor when available, ledger/check identifiers, evidence counts, and redacted metadata only.',
} as const;

export type QaLedgerAuditAction = (typeof QA_LEDGER_AUDIT_POLICY.requiredActions)[number];

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function buildQaEvidenceRetentionState(record: { createdAt?: Date | string | null; evidenceCount?: number | null }, now = new Date()) {
  const createdAt = record.createdAt ? new Date(record.createdAt) : now;
  const reviewUntil = addDays(createdAt, QA_EVIDENCE_RETENTION_POLICY.evidenceReviewDays);
  const deleteAfter = addDays(createdAt, QA_EVIDENCE_RETENTION_POLICY.evidenceDeleteAfterDays);
  const hasEvidence = (record.evidenceCount ?? 0) > 0;

  return {
    policyKey: QA_EVIDENCE_RETENTION_POLICY.policyKey,
    hasEvidence,
    reviewUntil,
    deleteAfter,
    purgeEligible: hasEvidence && now.getTime() >= deleteAfter.getTime(),
    purgeAction: QA_EVIDENCE_RETENTION_POLICY.purgeAction,
  };
}

export function sanitizeQaEvidenceText(value: string) {
  return value
    .replace(/\bauthorization\s*:\s*Bearer\s+[^,\s;]+/gi, 'authorization: [redacted]')
    .replace(/([?&](?:token|secret|password|apiKey|apikey|authorization|signature|signedUrl|url)=)[^&#\s]+/gi, '$1[redacted]')
    .replace(/\b(?:token|secret|password|apiKey|apikey|authorization|signature|signedUrl|providerKey)\s*[:=]\s*[^,&\s;]+/gi, (match) => {
      const separator = match.includes(':') ? ':' : '=';
      return `${match.slice(0, match.indexOf(separator)).trim()}${separator}[redacted]`;
    });
}

function toEvidenceRefs(input: QaVerificationLedgerDraftInput['evidence']) {
  return (input ?? []).map((evidence) => ({
    type: evidence.type,
    ref: sanitizeQaEvidenceText(evidence.ref),
    ...(evidence.note ? { note: sanitizeQaEvidenceText(evidence.note) } : {}),
  }));
}

function buildQaLedgerAuditMetadata(input: {
  ledgerId: string;
  packageVersion: string;
  phase: number;
  checkKey: string;
  layer: string;
  status: QaCheckStatus;
  severity: string;
  accepted: boolean;
  evidenceCount: number;
  productionReleaseAllowed: boolean;
}) {
  return {
    ledgerId: input.ledgerId,
    packageVersion: input.packageVersion,
    phase: input.phase,
    checkKey: input.checkKey,
    layer: input.layer,
    status: input.status,
    severity: input.severity,
    accepted: input.accepted,
    evidenceCount: input.evidenceCount,
    productionReleaseAllowed: input.productionReleaseAllowed,
    rawEvidenceStored: false,
    policyKey: QA_LEDGER_AUDIT_POLICY.policyKey,
  };
}

export function listQaLedgerAuditActions(input: { status: QaCheckStatus; evidenceCount: number }): QaLedgerAuditAction[] {
  return [
    'qa.ledger.entry_created',
    'qa.ledger.status_changed',
    input.evidenceCount > 0 ? 'qa.ledger.evidence_created' : null,
  ].filter(Boolean) as QaLedgerAuditAction[];
}

export async function recordQaLedgerAuditEvent(input: {
  organizationId: string;
  actorUserId?: string | null;
  ledgerId: string;
  action: QaLedgerAuditAction;
  metadata: Record<string, unknown>;
}) {
  return recordAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    targetType: 'qa_verification_ledger',
    targetId: input.ledgerId,
    metadata: {
      ...input.metadata,
      policyKey: QA_LEDGER_AUDIT_POLICY.policyKey,
    },
  });
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
    storagePolicy: QA_EVIDENCE_STORAGE_POLICY,
    retentionPolicy: QA_EVIDENCE_RETENTION_POLICY,
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

  const auditMetadata = buildQaLedgerAuditMetadata({ ...draft, ledgerId: record.id });
  const auditActions = listQaLedgerAuditActions({ status: draft.status, evidenceCount: draft.evidenceCount });
  const auditEvents = await Promise.all(
    auditActions.map((action) =>
      recordQaLedgerAuditEvent({
        organizationId: draft.organizationId,
        actorUserId: draft.userId ?? null,
        ledgerId: record.id,
        action,
        metadata: auditMetadata,
      })
    )
  );

  return { ...draft, id: record.id, persisted: true, auditPolicy: QA_LEDGER_AUDIT_POLICY, auditActions, auditEvents };
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
  const now = new Date();
  return {
    total: records.length,
    passed: records.filter((r) => r.status === 'PASS').length,
    failed: records.filter((r) => r.status === 'FAIL').length,
    blocked: records.filter((r) => r.status === 'BLOCKED').length,
    notRun: records.filter(
      (r) => r.status === 'NOT_RUN' || r.status === 'CODEX_REQUIRED' || r.status === 'SCAFFOLDED'
    ).length,
    productionReady: false,
    storagePolicy: QA_EVIDENCE_STORAGE_POLICY,
    retentionPolicy: QA_EVIDENCE_RETENTION_POLICY,
    auditPolicy: QA_LEDGER_AUDIT_POLICY,
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
      retention: buildQaEvidenceRetentionState(r, now),
      productionReleaseAllowed: r.productionReleaseAllowed,
      createdAt: r.createdAt,
    })),
  };
}
