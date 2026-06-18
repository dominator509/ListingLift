import { PERMISSIONS } from '@/domain/permissions';
import { agencyDashboardRequestSchema } from '@/schemas/agency-white-label';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { assertAgencyWhiteLabelAccess } from '@/server/services/agency-white-label-access-service';
import { buildAgencyDashboardSummary } from '@/server/services/agency-dashboard-summary-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageClients);
    assertAgencyWhiteLabelAccess(session);
    const query = agencyDashboardRequestSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    return { query, summary: buildAgencyDashboardSummary(), codexNote: 'Codex must replace dry-run agency dashboard data with tenant-scoped Prisma queries and agency RBAC.' };
  });
}
