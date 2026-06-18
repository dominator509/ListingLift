import { adminDashboardEventSchema } from '@/schemas/admin-dashboard-analytics';
import { guardedPost, parseJson } from '@/server/routes/route-helpers';
import { buildAdminDashboardEventDraft } from '@/server/services/admin-dashboard-event-service';

export async function POST(request: Request) {
  return guardedPost(request, 'view:revenue', async (session) => {
    const body = adminDashboardEventSchema.parse(await parseJson(request, {}));
    return {
      event: buildAdminDashboardEventDraft({ ...body, organizationId: session.organizationId, userId: session.userId }),
      codexNote: 'Codex must persist admin analytics events transactionally and exclude secrets, raw webhook payloads, signed URLs, and private marketplace credentials.',
    };
  });
}
