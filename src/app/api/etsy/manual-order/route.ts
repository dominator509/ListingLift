import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { etsyManualOrderInputSchema } from '@/schemas/etsy';
import { createEtsyManualOrderPlan } from '@/server/services/etsy-order-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = etsyManualOrderInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createEtsyManualOrderPlan(input), note: 'Seed dry-run route. Codex must create Client, ExternalOrder, Job, UploadToken, EtsyWorkflowEvent, revenue attribution, and AuditLog rows transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
