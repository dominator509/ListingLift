import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'view:revenue', async () => ({ items: [], note: 'Report and upsell draft services are scaffolded.' }));
}
