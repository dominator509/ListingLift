import { buildPresetAdminDraft, getPresetManagerSummary, listDefaultPresets } from '@/server/services/preset-service';
import { guardedPost, parseJson } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform') ?? undefined;
  const includeSummary = url.searchParams.get('summary') === 'true';
  return Response.json({
    ok: true,
    data: includeSummary ? getPresetManagerSummary() : listDefaultPresets({ activeOnly: true, platform }),
  });
}

export async function POST(request: Request) {
  return guardedPost(request, 'manage:presets', async () => {
    const body = await parseJson(request, {});
    return buildPresetAdminDraft(body as never);
  });
}
