import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { shopifyProductCsvImportInputSchema } from '@/schemas/shopify';
import { createShopifyProductCsvImportPlan } from '@/server/services/shopify-product-import-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = shopifyProductCsvImportInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createShopifyProductCsvImportPlan(input), note: 'Seed CSV import planner. Codex must wire product/SKU rows to tenant-scoped Shopify product metadata and jobs.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
