import { agencyBrandedDeliveryTemplateSchema } from '@/schemas/agency-white-label';
import { guardedSession, parseJson } from '@/server/routes/route-helpers';
import { assertCanManageAgencyBranding } from '@/server/services/agency-white-label-access-service';
import { buildAgencyBrandedDeliveryDraft } from '@/server/services/agency-white-label-settings-service';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertCanManageAgencyBranding(session);
    const body = await parseJson(request, {});
    const draft = buildAgencyBrandedDeliveryDraft(agencyBrandedDeliveryTemplateSchema.parse(body));
    return { dryRun: true, draft, codexNote: 'Codex must enforce approved delivery archives, expiring hashed delivery tokens, download limits, and audit logs.' };
  });
}
