import { getAssignableRoles } from '@/server/services/team-service';
import { guardedSession } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedSession(request, async (session) => ({ items: getAssignableRoles(session) }));
}
