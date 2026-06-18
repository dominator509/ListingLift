import { agencyWorkspaceDraftSchema, agencyWorkspaceQuerySchema } from '@/schemas/agency-white-label';
import { guardedSession, parseJson } from '@/server/routes/route-helpers';
import { assertCanManageAgencyWorkspaces } from '@/server/services/agency-white-label-access-service';
import { buildAgencyWorkspaceRows, validateAgencyWorkspaceDraft } from '@/server/services/agency-workspace-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertCanManageAgencyWorkspaces(session);
    const query = agencyWorkspaceQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    return { dryRun: true, query, workspaces: buildAgencyWorkspaceRows(undefined, query), codexNote: 'Codex must load agency workspaces from tenant-scoped Client/Organization/Job records.' };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertCanManageAgencyWorkspaces(session);
    const body = await parseJson(request, {});
    const draft = validateAgencyWorkspaceDraft(agencyWorkspaceDraftSchema.parse(body));
    return { dryRun: true, draft, auditRequired: true, codexNote: 'Codex must persist workspace drafts transactionally and audit client workspace creation.' };
  });
}
