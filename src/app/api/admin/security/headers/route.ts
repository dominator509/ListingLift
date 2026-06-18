import { PERMISSIONS } from '@/domain/permissions';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { getSecurityHeaderPolicyRows } from '@/server/services/security-headers-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    return {
      headers: getSecurityHeaderPolicyRows(process.env.NODE_ENV === 'production' ? 'production' : 'development'),
      middlewarePatched: true,
      codexNote: 'Codex must browser-smoke-check actual response headers in the deployed Next runtime for organization ' + session.organizationId + '.',
    };
  });
}
