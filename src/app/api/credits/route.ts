import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'adjust:credits', async () => ({ note: 'Credit ledger service scaffold exists.' }));
}
