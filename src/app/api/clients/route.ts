import { guardedGet, guardedPost, parseJson } from '@/server/routes/route-helpers';
import { validateClientCreate } from '@/server/services/client-service';
import { buildClientWhereForSession } from '@/server/services/client-access-service';
import type { SessionContext } from '@/schemas/auth';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:clients', async () => ({
    items: [],
    where: buildClientWhereForSession(await import('@/server/services/auth-session-service').then(({ requireSession }) => requireSession(request)) as SessionContext),
    note: 'Client CRUD scaffold. Codex must replace empty items with Prisma client.findMany using this tenant/client scope.',
  }));
}

export async function POST(request: Request) {
  return guardedPost(request, 'manage:clients', async (session) => {
    const input = validateClientCreate({ ...(await parseJson<Record<string, unknown>>(request, {})), organizationId: session.organizationId } as unknown as { organizationId: string; name: string; businessName?: string; email?: string; sourceChannel?: string; assignedAdminUserId?: string; status?: 'ACTIVE' | 'PAUSED' | 'LEAD' | 'ARCHIVED' });
    return {
      accepted: true,
      input,
      note: 'Codex must create client with organizationId from session only, not from untrusted request body, and audit the mutation.',
    };
  });
}
