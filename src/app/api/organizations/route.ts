import { guardedGet, guardedPost, parseJson } from '@/server/routes/route-helpers';
import type { OrganizationInput } from '@/schemas/organization';
import type { SessionContext } from '@/schemas/auth';
import { buildOrganizationWhereForSession, validateOrganizationInput } from '@/server/services/organization-service';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:team', async () => ({
    items: [],
    where: buildOrganizationWhereForSession(await import('@/server/services/auth-session-service').then(({ requireSession }) => requireSession(request)) as SessionContext),
    note: 'Organization query is scoped. Codex must connect this to Prisma.',
  }));
}

export async function POST(request: Request) {
  return guardedPost(request, 'manage:team', async () => {
    const input = validateOrganizationInput(await parseJson<Record<string, unknown>>(request, {}) as OrganizationInput);
    return {
      accepted: true,
      input,
      note: 'Codex must restrict organization creation to super-admin/platform flows unless explicitly onboarding an agency workspace.',
    };
  });
}
