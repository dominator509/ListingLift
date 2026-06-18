import { guardedGet } from '@/server/routes/route-helpers';
import { listEmailAdapterHealth } from '@/server/adapters/email/registry';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:integrations', async () => ({ adapters: await listEmailAdapterHealth() }));
}
