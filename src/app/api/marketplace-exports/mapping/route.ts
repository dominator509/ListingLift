import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { marketplaceMappingInputSchema } from '@/schemas/amazon-ebay-woocommerce';
import { createMarketplaceExportMappingDraft, listMarketplaceExportMappings } from '@/server/services/marketplace-export-mapping-service';

export async function GET() {
  try {
    return jsonOk({ mappings: listMarketplaceExportMappings() });
  } catch (error) {
    return mapServiceError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = marketplaceMappingInputSchema.parse(body);
    return jsonOk({ draft: createMarketplaceExportMappingDraft(input), note: 'Seed route. Codex must persist organization-scoped mappings with manage:sales-channels and audit logs.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
