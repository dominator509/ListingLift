import { jsonOk } from '@/lib/api-response';
import { listOtherSalesChannelCatalog, validateOtherSalesChannelCoverage } from '@/server/services/generic-sales-channel-catalog-service';

export async function GET() {
  return jsonOk({ channels: listOtherSalesChannelCatalog(), coverage: validateOtherSalesChannelCoverage() });
}
