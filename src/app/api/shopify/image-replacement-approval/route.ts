import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { shopifyReplacementApprovalInputSchema } from '@/schemas/shopify';
import { createShopifyImageReplacementApprovalPlan } from '@/server/services/shopify-image-replacement-approval-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = shopifyReplacementApprovalInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createShopifyImageReplacementApprovalPlan(input), note: 'Seed approval planner. Codex must persist product-level replacement decisions and prevent unapproved image replacement.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
