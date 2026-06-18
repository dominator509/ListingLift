import { guardedGet, guardedPost, parseJson } from '@/server/routes/route-helpers';
import type { TeamInviteInput } from '@/schemas/rbac';
import { buildMembershipCreateData, validateTeamInvite } from '@/server/services/team-service';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:team', async () => ({
    items: [],
    note: 'Team membership list must be connected to Prisma by Codex. Server-side permission gate is active.',
  }));
}

export async function POST(request: Request) {
  return guardedPost(request, 'manage:team', async (session) => {
    const input = validateTeamInvite(await parseJson<Record<string, unknown>>(request, {}) as TeamInviteInput);
    return {
      accepted: true,
      invite: input,
      membershipPreview: buildMembershipCreateData(session, input, 'codex-user-id-placeholder', 'codex-role-id-placeholder'),
      note: 'Codex must connect this preview to real user invitation/upsert logic and email delivery.',
    };
  });
}
