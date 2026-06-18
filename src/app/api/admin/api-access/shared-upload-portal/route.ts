import { PERMISSIONS } from '@/domain/permissions';
import { sharedUploadPortalDraftSchema } from '@/schemas/api-access';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildSharedUploadPortalRows } from '@/server/services/api-access-dashboard-service';
import { buildSharedUploadPortalDraft } from '@/server/services/advanced-integration-catalog-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    return { portals: buildSharedUploadPortalRows(), codexNote: 'Codex must load tenant-scoped portal records and never return raw portal tokens.' };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const body = sharedUploadPortalDraftSchema.parse(await parseJson(request, {}));
    const draft = buildSharedUploadPortalDraft({ ...body, organizationId: session.organizationId, createdByUserId: session.userId });
    return { portalToken: draft.portalToken, portalTokenMasked: draft.portalTokenMasked, portalRecordPreview: { ...draft.portalRecord, tokenHash: '[redacted-hash]' }, showOnceWarning: draft.showOnceWarning, codexNote: 'Raw portal token is shown once only. Codex must persist hash, scope server-side, enforce upload safety, and preserve originals.' };
  });
}
