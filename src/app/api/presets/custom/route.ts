import { buildCustomPresetDraft } from '@/server/services/preset-service';
import { guardedPost, parseJson } from '@/server/routes/route-helpers';

export async function POST(request: Request) {
  return guardedPost(request, 'manage:presets', async () => {
    const body = await parseJson(request, {});
    return buildCustomPresetDraft(body as never);
  });
}
