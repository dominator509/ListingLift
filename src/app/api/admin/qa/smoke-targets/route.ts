import { PERMISSIONS } from '@/domain/permissions';
import { qaSmokeTargetQuerySchema } from '@/schemas/full-testing-qa';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { getQaSmokeRouteTargets, summarizeQaSmokeTargets } from '@/server/services/full-testing-qa-smoke-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageQa);
    const query = qaSmokeTargetQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    return {
      summary: summarizeQaSmokeTargets(),
      smokeTargets: getQaSmokeRouteTargets(query.group),
      codexNote: 'Smoke targets must be browser-rendered and checked with actual session/RBAC behavior before production for organization ' + session.organizationId + '.',
    };
  });
}
