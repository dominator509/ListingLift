import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'view:client-dashboard', async () => ({ authenticated: true, strategy: 'server-session-scaffold' }));
}
