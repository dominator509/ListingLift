import { PERMISSIONS } from '@/domain/permissions';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { getApiScopeMatrix } from '@/server/services/api-access-plan-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const planKey = new URL(request.url).searchParams.get('planKey') ?? 'AGENCY';
    return { planKey, scopes: getApiScopeMatrix(planKey), codexNote: 'Codex must derive plan from verified subscription/agency billing entitlement rather than trusting query params.' };
  });
}
