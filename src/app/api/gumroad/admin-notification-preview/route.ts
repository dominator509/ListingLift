import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { gumroadPurchaseIntakeRequestSchema } from '@/schemas/gumroad';
import { createGumroadPurchaseIntakePlan } from '@/server/services/gumroad-purchase-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = gumroadPurchaseIntakeRequestSchema.parse({ ...body, payload: body.payload ?? body, dryRun: true });
    const plan = createGumroadPurchaseIntakePlan(input);
    return jsonOk({ notification: plan.adminNotificationPlan, uploadLinkPlan: plan.uploadLinkPlan, redactedBuyer: plan.clientDraft.redactedEmail });
  } catch (error) {
    return mapServiceError(error);
  }
}
