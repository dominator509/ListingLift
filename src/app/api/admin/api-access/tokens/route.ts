import { PERMISSIONS } from '@/domain/permissions';
import { apiTokenCreateSchema, apiTokenQuerySchema } from '@/schemas/api-access';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildApiTokenRows } from '@/server/services/api-access-dashboard-service';
import { issueApiTokenDraft, redactedApiTokenRecord } from '@/server/services/api-access-token-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const query = apiTokenQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    return { query, tokens: buildApiTokenRows(), codexNote: 'Codex must replace dry-run token rows with tenant-scoped Prisma ApiAccessToken records and never return tokenHash or raw token.' };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageApiAccess);
    const body = apiTokenCreateSchema.parse(await parseJson(request, {}));
    const draft = issueApiTokenDraft({ ...body, organizationId: session.organizationId, createdByUserId: session.userId });
    return { token: draft.token, maskedToken: draft.maskedToken, showOnceWarning: draft.showOnceWarning, recordPreview: redactedApiTokenRecord(draft.record), auditEvent: draft.auditEvent, codexNote: 'Raw token is included only in this one-time draft response. Codex must persist hash only, then never return raw token again.' };
  });
}
