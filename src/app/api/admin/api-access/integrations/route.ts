import { PERMISSIONS } from '@/domain/permissions';
import { advancedIntegrationConnectionDraftSchema } from '@/schemas/api-access';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildAdvancedIntegrationConnectionDraft, listAdvancedIntegrationCatalog } from '@/server/services/advanced-integration-catalog-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    return { catalog: listAdvancedIntegrationCatalog(), codexNote: 'Real integration providers remain disabled until feature flags, encrypted secret references, and provider verification are wired.' };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const body = advancedIntegrationConnectionDraftSchema.parse(await parseJson(request, {}));
    return { dryRun: true, connection: buildAdvancedIntegrationConnectionDraft({ ...body, organizationId: session.organizationId, createdByUserId: session.userId }), codexNote: 'Codex must persist integration connection with encrypted secret references only and keep provider disabled by default.' };
  });
}
