import { PERMISSIONS } from '@/domain/permissions';
import { apiTokenRevokeSchema } from '@/schemas/api-access';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildApiTokenRevokeDraft } from '@/server/services/api-access-token-service';

export async function POST(request: Request, context: { params: Promise<{ tokenId: string }> }) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const { tokenId } = await context.params;
    const body = apiTokenRevokeSchema.parse({ ...(await parseJson(request, {})), tokenId });
    return { revoke: buildApiTokenRevokeDraft({ ...body, organizationId: session.organizationId, actorUserId: session.userId }), codexNote: 'Codex must revoke tenant-scoped token transactionally and audit the action.' };
  });
}
