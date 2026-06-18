import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { marketplaceRevisionStatusInputSchema } from '@/schemas/amazon-ebay-woocommerce';
import { createMarketplaceRevisionStatusDraft } from '@/server/services/marketplace-revision-workflow-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = marketplaceRevisionStatusInputSchema.parse(body);
    return jsonOk({ draft: createMarketplaceRevisionStatusDraft(input), note: 'Seed route. Codex must persist revision workflow events and block completion while open.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
