import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { marketplaceExportPlanInputSchema } from '@/schemas/amazon-ebay-woocommerce';
import { createMarketplaceExportPlan } from '@/server/services/marketplace-export-plan-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = marketplaceExportPlanInputSchema.parse(body);
    return jsonOk({ exportPlan: createMarketplaceExportPlan(input), note: 'Seed route. Codex must build actual export plans from approved ProcessedFile rows and selected presets only.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
