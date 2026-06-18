import { PERMISSIONS } from '@/domain/permissions';
import { apiAccessEventSchema } from '@/schemas/api-access';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildApiAccessEventDraft } from '@/server/services/api-access-event-service';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const body = apiAccessEventSchema.parse(await parseJson(request, {}));
    return { event: buildApiAccessEventDraft({ ...body, organizationId: session.organizationId, actorUserId: session.userId }), codexNote: 'Codex must persist sanitized event metadata and never log secrets or raw tokens.' };
  });
}
