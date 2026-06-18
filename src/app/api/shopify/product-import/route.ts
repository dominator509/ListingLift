import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { shopifyProductCsvImportInputSchema } from '@/schemas/shopify';
import { createShopifyProductCsvImportPlan } from '@/server/services/shopify-product-import-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = shopifyProductCsvImportInputSchema.parse({ ...body, importMode: body.importMode ?? 'API_SCAFFOLD', dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createShopifyProductCsvImportPlan(input), note: 'Seed API/OAuth product import scaffold. Codex must use official Shopify APIs only when feature-flagged and authorized.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
