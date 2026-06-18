import { SECURITY_CONTROL_CHECKLIST } from '@/domain/security-hardening';
import { getSecurityHeaderPolicyRows } from '@/server/services/security-headers-service';
import { buildSecurityAuditCompletenessSummary, getSecurityAuditCoverageRows } from '@/server/services/audit-completeness-map-service';

export function buildSecurityHardeningSummary() {
  const controls = SECURITY_CONTROL_CHECKLIST;
  return {
    phase: 37,
    totalControls: controls.length,
    criticalControls: controls.filter((control) => control.riskLevel === 'critical').length,
    codexRequiredControls: controls.filter((control) => control.codexRequired).length,
    scaffoldedControls: controls.filter((control) => control.status === 'SCAFFOLDED').length,
    blockedControls: controls.filter((control) => control.status === 'BLOCKED').length,
    productionReady: false,
  };
}

export function buildSecurityControlRows() {
  return SECURITY_CONTROL_CHECKLIST.map((control) => ({ ...control, productionVerified: false }));
}

export function buildSecurityDashboardSnapshot() {
  return {
    summary: buildSecurityHardeningSummary(),
    controls: buildSecurityControlRows(),
    headers: getSecurityHeaderPolicyRows('production'),
    audit: buildSecurityAuditCompletenessSummary(),
    auditRows: getSecurityAuditCoverageRows(),
    codexNote: 'Phase 37 is a security-hardening scaffold. Codex must runtime-wire, execute security tests, validate browser headers, and verify all controls before production.',
  };
}
