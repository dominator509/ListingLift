import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { genericManualOrderInputSchema } from '@/schemas/generic-sales-channels';
import { createGenericSalesChannelManualOrderPlan } from '@/server/services/generic-channel-manual-order-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = genericManualOrderInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createGenericSalesChannelManualOrderPlan(input), note: 'Seed dry-run route. Codex must create Client, ExternalOrder, Job, UploadToken, GenericSalesChannelWorkflowEvent, revenue attribution, and AuditLog rows transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
