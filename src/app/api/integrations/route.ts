import { listImageProviderHealth } from '@/server/adapters/image/registry';
import { listSalesChannelAdapterHealth } from '@/server/adapters/sales-channel/registry';
import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:integrations', async () => ({ imageProviders: await listImageProviderHealth(), salesChannels: await listSalesChannelAdapterHealth() }));
}
