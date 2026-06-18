import { guardedSession } from '@/server/routes/route-helpers';
import { buildAgencyClientWhere } from '@/server/services/agency-service';

export async function GET(request: Request) {
  const url = new URL(request.url);
  return guardedSession(request, async (session) => ({
    items: [],
    where: buildAgencyClientWhere(session, {
      status: (url.searchParams.get('status') as 'LEAD' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | null) ?? undefined,
      search: url.searchParams.get('search') ?? undefined,
    }),
    note: 'Agency client query is tenant-scoped. Codex must connect it to Prisma client.findMany.',
  }));
}
