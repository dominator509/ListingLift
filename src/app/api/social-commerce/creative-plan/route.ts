import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { socialCommerceCreativePlanInputSchema } from '@/schemas/social-commerce';
import { createSocialCommerceCreativePlan } from '@/server/services/social-commerce-creative-plan-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ creativePlan: createSocialCommerceCreativePlan(socialCommerceCreativePlanInputSchema.parse(body)) }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
