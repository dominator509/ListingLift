import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'send:delivery', async () => ({ note: 'Delivery is hidden until approval. Token service and visibility guard are scaffolded.' }));
}
