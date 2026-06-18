import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { shopifyOAuthScaffoldInputSchema } from '@/schemas/shopify';
import { createShopifyOAuthScaffoldPlan } from '@/server/services/shopify-oauth-scaffold-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = shopifyOAuthScaffoldInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createShopifyOAuthScaffoldPlan(input), note: 'OAuth is scaffold-only. Codex must keep real OAuth disabled until feature flags, encrypted secrets, callback validation, and tests pass.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
