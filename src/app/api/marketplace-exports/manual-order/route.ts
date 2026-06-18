import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { marketplaceManualOrderInputSchema } from '@/schemas/amazon-ebay-woocommerce';
import { createMarketplaceManualOrderPlan } from '@/server/services/marketplace-manual-order-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = marketplaceManualOrderInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createMarketplaceManualOrderPlan(input), note: 'Seed dry-run route. Codex must create Client, ExternalOrder, Job, UploadToken, MarketplaceExportWorkflowEvent, revenue attribution, and AuditLog rows transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
