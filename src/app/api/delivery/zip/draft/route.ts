import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { deliveryArchivePlanRequestSchema } from '@/schemas/delivery-packaging';
import { DEFAULT_PLATFORM_PRESETS } from '@/domain/platform-presets';
import { buildDeliveryArchivePlan } from '@/server/services/delivery-packaging-service';
import { buildZipEntryPlan } from '@/server/services/zip-delivery-service';
import { buildDeliveryArchivePersistenceDraft } from '@/server/services/delivery-archive-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'export:delivery-files');
    const body = deliveryArchivePlanRequestSchema.parse(await parseJson(request, {}));
    const selectedPresets = DEFAULT_PLATFORM_PRESETS.filter((preset) => !body.selectedPresetKeys.length || body.selectedPresetKeys.includes(preset.key));
    const plan = buildDeliveryArchivePlan({ ...body, selectedPresets, generatedByUserId: session.userId });
    return jsonOk({
      zipFileName: plan.zipFileName,
      zipStorageKey: plan.zipStorageKey,
      entries: buildZipEntryPlan(plan),
      persistenceDraft: buildDeliveryArchivePersistenceDraft(plan),
      note: 'Dry-run ZIP draft only. Codex must load file bytes from storage and persist the archive transactionally.',
    });
  } catch (error) {
    return mapServiceError(error);
  }
}
