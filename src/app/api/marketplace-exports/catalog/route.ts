import { jsonOk, mapServiceError } from '@/lib/api-response';
import { listMarketplaceExportMappings } from '@/server/services/marketplace-export-mapping-service';

export async function GET() {
  try {
    return jsonOk({ channels: listMarketplaceExportMappings() });
  } catch (error) {
    return mapServiceError(error);
  }
}
