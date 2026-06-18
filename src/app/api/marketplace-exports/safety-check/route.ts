import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { marketplaceSafetyCheckInputSchema } from '@/schemas/amazon-ebay-woocommerce';
import { runMarketplaceWorkflowSafetyCheck } from '@/server/services/marketplace-workflow-safety-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = marketplaceSafetyCheckInputSchema.parse(body);
    return jsonOk({ safety: runMarketplaceWorkflowSafetyCheck(input) });
  } catch (error) {
    return mapServiceError(error);
  }
}
