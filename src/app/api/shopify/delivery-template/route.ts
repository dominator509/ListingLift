import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { shopifyDeliveryTemplateInputSchema } from '@/schemas/shopify';
import { createShopifyDeliveryTemplate } from '@/server/services/shopify-delivery-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = shopifyDeliveryTemplateInputSchema.parse(body);
    return jsonOk({ template: createShopifyDeliveryTemplate(input), note: 'Manual operator copy only. Do not automate Shopify product replacement or messaging without approved integration authorization.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
