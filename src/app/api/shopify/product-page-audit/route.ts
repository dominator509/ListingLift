import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { shopifyProductAuditInputSchema } from '@/schemas/shopify';
import { createShopifyProductPageAudit } from '@/server/services/shopify-delivery-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = shopifyProductAuditInputSchema.parse(body);
    return jsonOk({ audit: createShopifyProductPageAudit(input), note: 'Seed audit generator. Codex must persist report rows and enforce merchant-review wording.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
