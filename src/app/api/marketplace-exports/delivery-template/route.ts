import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { marketplaceDeliveryTemplateInputSchema } from '@/schemas/amazon-ebay-woocommerce';
import { createMarketplaceDeliveryTemplate } from '@/server/services/marketplace-delivery-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = marketplaceDeliveryTemplateInputSchema.parse(body);
    return jsonOk({ template: createMarketplaceDeliveryTemplate(input), note: 'Seed route. Codex must only generate delivery messages for approved archives and allowed link contexts.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
