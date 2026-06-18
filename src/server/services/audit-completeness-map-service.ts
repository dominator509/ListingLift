import { AUDIT_COMPLETENESS_MAP_DRAFT, redactSecurityMetadata } from '@/domain/security-hardening';
import { securityAuditEventDraftSchema, type SecurityAuditEventDraftInput } from '@/schemas/security-hardening';

export function getSecurityAuditCoverageRows() {
  return AUDIT_COMPLETENESS_MAP_DRAFT.map((row) => ({
    ...row,
    status: 'CODEX_REQUIRED' as const,
    routeWiringRequired: true,
    metadataRedactionRequired: row.forbiddenMetadata.length > 0,
  }));
}

export function buildSecurityAuditCompletenessSummary() {
  const rows = getSecurityAuditCoverageRows();
  return {
    totalSensitiveActions: rows.length,
    codexRequired: rows.filter((row) => row.status === 'CODEX_REQUIRED').length,
    redactionRequired: rows.filter((row) => row.metadataRedactionRequired).length,
    requiredBeforeProduction: true,
  };
}

export function buildSecurityAuditEventDraft(input: SecurityAuditEventDraftInput) {
  const parsed = securityAuditEventDraftSchema.parse(input);
  return {
    organizationId: parsed.organizationId,
    userId: parsed.userId ?? null,
    eventType: parsed.eventType,
    controlArea: parsed.controlArea,
    route: parsed.route ?? null,
    resourceType: parsed.resourceType ?? null,
    resourceId: parsed.resourceId ?? null,
    metadata: redactSecurityMetadata(parsed.metadata),
    createdAt: new Date(),
    codexNote: 'Codex must persist this through the unified audit log and verify tenant scope before recording sensitive events.',
  };
}
