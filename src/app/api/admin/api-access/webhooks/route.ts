import { PERMISSIONS } from '@/domain/permissions';
import { apiWebhookSubscriptionDraftSchema } from '@/schemas/api-access';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildApiWebhookRows } from '@/server/services/api-access-dashboard-service';
import { buildApiWebhookSubscriptionDraft } from '@/server/services/advanced-integration-catalog-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    return { webhooks: buildApiWebhookRows(), codexNote: 'Codex must query tenant-scoped webhook subscriptions and redact signing secret hashes/references.' };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const body = apiWebhookSubscriptionDraftSchema.parse(await parseJson(request, {}));
    return { dryRun: true, webhook: buildApiWebhookSubscriptionDraft({ ...body, organizationId: session.organizationId, createdByUserId: session.userId }), codexNote: 'Codex must store signing secret hash/reference only, verify delivery signatures, and add retry/dead-letter handling.' };
  });
}
