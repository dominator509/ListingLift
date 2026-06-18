import { guardedSession } from '@/server/routes/route-helpers';
import { assertClientAccess } from '@/server/services/client-access-service';

export async function GET(request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;
  return guardedSession(request, async (session) => {
    assertClientAccess(session, { id: clientId, organizationId: session.organizationId });
    return {
      item: null,
      clientId,
      note: 'Codex must load the client by id with organization/client scope enforced before returning data.',
    };
  });
}
