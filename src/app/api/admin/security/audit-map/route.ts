import { PERMISSIONS } from '@/domain/permissions';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildSecurityAuditCompletenessSummary, getSecurityAuditCoverageRows } from '@/server/services/audit-completeness-map-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    return {
      summary: buildSecurityAuditCompletenessSummary(),
      rows: getSecurityAuditCoverageRows(),
      codexNote: 'Codex must persist sanitized audit events and verify coverage across all sensitive routes/services for organization ' + session.organizationId + '.',
    };
  });
}
