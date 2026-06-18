import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { deliveryArchivePlanRequestSchema } from '@/schemas/delivery-packaging';
import { DEFAULT_PLATFORM_PRESETS } from '@/domain/platform-presets';
import { buildDeliveryArchivePlan } from '@/server/services/delivery-packaging-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'export:delivery-files');
    const body = deliveryArchivePlanRequestSchema.parse({ ...(await parseJson(request, {})), jobId: (await params).jobId });
    const selectedPresets = DEFAULT_PLATFORM_PRESETS.filter((preset) => !body.selectedPresetKeys.length || body.selectedPresetKeys.includes(preset.key));
    const plan = buildDeliveryArchivePlan({ ...body, selectedPresets, generatedByUserId: session.userId });
    return jsonOk({ plan, note: 'Job-scoped dry-run archive plan. Codex must query tenant-scoped processed files by job ID.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
