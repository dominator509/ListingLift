import { PERMISSIONS } from '@/domain/permissions';
import { apiPlanGateRequestSchema } from '@/schemas/api-access';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildApiPlanGateDecision } from '@/server/services/api-access-plan-service';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const body = apiPlanGateRequestSchema.parse(await parseJson(request, {}));
    return { decision: buildApiPlanGateDecision(body), codexNote: 'Codex must evaluate API plan gate from verified payment/subscription records and persist audit events.' };
  });
}
