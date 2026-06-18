import { agencyTeamInviteDraftSchema } from '@/schemas/agency-white-label';
import { guardedSession, parseJson } from '@/server/routes/route-helpers';
import { assertCanManageAgencyTeam } from '@/server/services/agency-white-label-access-service';
import { buildAgencyTeamInviteDraft, buildAgencyTeamRows } from '@/server/services/agency-team-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertCanManageAgencyTeam(session);
    return { dryRun: true, members: buildAgencyTeamRows(), codexNote: 'Codex must load agency team memberships with server-side role and tenant filters.' };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertCanManageAgencyTeam(session);
    const body = await parseJson(request, {});
    const invite = buildAgencyTeamInviteDraft(agencyTeamInviteDraftSchema.parse(body));
    return { dryRun: true, invite, codexNote: 'Codex must create expiring hashed invite tokens, send through approved provider, and audit role assignment.' };
  });
}
