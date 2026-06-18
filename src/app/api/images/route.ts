import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:jobs', async () => ({ items: [], note: 'Image metadata and processing records begin Phase 8-11.' }));
}
