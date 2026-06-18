import { PERMISSIONS } from '@/domain/permissions';
import { securityDashboardQuerySchema } from '@/schemas/security-hardening';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildSecurityDashboardSnapshot } from '@/server/services/security-dashboard-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    const query = securityDashboardQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const snapshot = buildSecurityDashboardSnapshot();
    const controls = snapshot.controls.filter((control) => (!query.area || control.area === query.area) && (!query.status || control.status === query.status));
    return {
      ...snapshot,
      controls,
      query,
      codexNote: 'Codex must replace dry-run security dashboard rows with tenant-scoped control status, audit evidence, and runtime verification artifacts.',
    };
  });
}
