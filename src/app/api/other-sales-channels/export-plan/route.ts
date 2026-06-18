import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createGenericSalesChannelExportPlan } from '@/server/services/generic-channel-export-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ plan: createGenericSalesChannelExportPlan({ channelKey: typeof body.channelKey === 'string' ? body.channelKey : undefined, includeRevenue: body.includeRevenue !== false, includeFollowUps: body.includeFollowUps !== false }) });
  } catch (error) {
    return mapServiceError(error);
  }
}
