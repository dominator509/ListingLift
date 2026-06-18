import { imageProviderRegistry } from '@/server/adapters/image/registry';
import { paymentAdapterRegistry } from '@/server/adapters/payments/registry';
import { salesChannelAdapterRegistry } from '@/server/adapters/sales-channel/registry';

export async function GET() {
  const adapters = [...Object.values(imageProviderRegistry), ...Object.values(paymentAdapterRegistry), ...Object.values(salesChannelAdapterRegistry)];
  const results = await Promise.all(adapters.map((adapter) => adapter.healthCheck()));
  return Response.json({ ok: true, data: results });
}
