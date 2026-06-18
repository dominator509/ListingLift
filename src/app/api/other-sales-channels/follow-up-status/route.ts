import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { genericFollowUpStatusInputSchema } from '@/schemas/generic-sales-channels';
import { createGenericFollowUpStatusPlan } from '@/server/services/generic-channel-follow-up-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ plan: createGenericFollowUpStatusPlan(genericFollowUpStatusInputSchema.parse({ ...body, dryRun: body.dryRun ?? true })) }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
