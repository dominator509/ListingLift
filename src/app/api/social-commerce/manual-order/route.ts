import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { socialCommerceManualOrderInputSchema } from '@/schemas/social-commerce';
import { createSocialCommerceManualOrderPlan } from '@/server/services/social-commerce-order-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = socialCommerceManualOrderInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createSocialCommerceManualOrderPlan(input), note: 'Seed dry-run route. Codex must create Client, ExternalOrder, Job, UploadToken, SocialCommerceWorkflowEvent, revenue attribution, and AuditLog rows transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
