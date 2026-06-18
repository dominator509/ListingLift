import { guardedGet } from '@/server/routes/route-helpers';
import { buildSalesChannelRegistrySummary } from '@/server/services/sales-channel-normalization-service';
import { findMissingRequiredSalesChannelAdapters } from '@/server/adapters/sales-channel/registry';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:sales-channels', async () => ({
    ...buildSalesChannelRegistrySummary(),
    missingRequiredAdapters: findMissingRequiredSalesChannelAdapters(),
  }));
}
