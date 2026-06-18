import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'view:client-dashboard', async () => ({ jobs: [], downloads: [], note: 'Client dashboard implemented Phase 33.' }));
}
