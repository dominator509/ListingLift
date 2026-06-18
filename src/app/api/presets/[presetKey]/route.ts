import { jsonFail, jsonOk } from '@/lib/api-response';
import { buildPresetAdminDraft, getPresetByKey, validatePresetKeyForAdmin } from '@/server/services/preset-service';
import { guardedPatch, parseJson } from '@/server/routes/route-helpers';

export async function GET(_request: Request, context: { params: Promise<{ presetKey: string }> | { presetKey: string } }) {
  const params = await context.params;
  const preset = getPresetByKey(params.presetKey);
  if (!preset) return jsonFail('not_found', 'Platform preset not found.', 404);
  return jsonOk({ preset, validation: validatePresetKeyForAdmin(params.presetKey) });
}

export async function PATCH(request: Request, context: { params: Promise<{ presetKey: string }> | { presetKey: string } }) {
  const params = await context.params;
  return guardedPatch(request, 'manage:presets', async () => {
    const body = await parseJson(request, {});
    return buildPresetAdminDraft({ ...(body as object), key: params.presetKey } as never);
  });
}
