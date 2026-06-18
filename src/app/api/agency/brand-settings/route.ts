import { guardedGet, guardedPatch, parseJson } from '@/server/routes/route-helpers';
import { assertCanManageAgencyBranding, validateAgencyBrandSettings } from '@/server/services/agency-service';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:agency-branding', async () => ({
    item: null,
    note: 'Codex must load BrandSetting for the active organization.',
  }));
}

export async function PATCH(request: Request) {
  return guardedPatch(request, 'manage:agency-branding', async (session) => {
    assertCanManageAgencyBranding(session);
    const input = validateAgencyBrandSettings(await parseJson(request, {}));
    return {
      accepted: true,
      input,
      note: 'Codex must upsert BrandSetting and audit agency branding changes.',
    };
  });
}
