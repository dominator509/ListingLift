import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createSocialCommerceExportPlan } from '@/server/services/social-commerce-export-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<{ channelKey?: string; jobId?: string; includeRevenue?: boolean }>(request, {});
    return jsonOk({ exportPlan: createSocialCommerceExportPlan({ channelKey: body.channelKey ?? 'instagram_profile', jobId: body.jobId, includeRevenue: body.includeRevenue }) }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
