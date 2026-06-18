import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { shopifyManualOrderInputSchema } from '@/schemas/shopify';
import { createShopifyManualOrderPlan } from '@/server/services/shopify-order-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = shopifyManualOrderInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createShopifyManualOrderPlan(input), note: 'Seed dry-run route. Codex must create Client, ExternalOrder, Job, UploadToken, ShopifyWorkflowEvent, revenue attribution, and AuditLog rows transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
