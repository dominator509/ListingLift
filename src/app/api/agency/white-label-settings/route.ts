import { agencyWhiteLabelSettingsDraftSchema } from '@/schemas/agency-white-label';
import { guardedSession, parseJson } from '@/server/routes/route-helpers';
import { assertCanManageAgencyBranding } from '@/server/services/agency-white-label-access-service';
import { buildAgencyWhiteLabelSettingsPreview, demoAgencyBrandSettings, validateAgencyWhiteLabelSettingsDraft } from '@/server/services/agency-white-label-settings-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertCanManageAgencyBranding(session);
    return { dryRun: true, settings: buildAgencyWhiteLabelSettingsPreview(demoAgencyBrandSettings), codexNote: 'Codex must load BrandSetting and Phase 35 branding review records by agency tenant.' };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertCanManageAgencyBranding(session);
    const body = await parseJson(request, {});
    const draft = validateAgencyWhiteLabelSettingsDraft(agencyWhiteLabelSettingsDraftSchema.parse(body));
    return { dryRun: true, settings: buildAgencyWhiteLabelSettingsPreview(draft), auditRequired: true, codexNote: 'Codex must persist draft settings, require manual review, and never expose secret DNS/provider values.' };
  });
}
