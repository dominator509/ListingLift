import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { shopifySafetyCheckSchema } from '@/schemas/shopify';
import { checkShopifyWorkflowSafety } from '@/server/services/shopify-workflow-safety-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = shopifySafetyCheckSchema.parse(body);
    return jsonOk({ safety: checkShopifyWorkflowSafety(input), note: 'Safety planner only. Blocking conditions must prevent persistence/execution in Codex implementation.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
