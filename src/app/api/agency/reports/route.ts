import { agencyBrandedReportDraftSchema } from '@/schemas/agency-white-label';
import { guardedSession, parseJson } from '@/server/routes/route-helpers';
import { assertCanManageAgencyBranding } from '@/server/services/agency-white-label-access-service';
import { buildAgencyBrandedReportDraft } from '@/server/services/agency-white-label-settings-service';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertCanManageAgencyBranding(session);
    const body = await parseJson(request, {});
    const report = buildAgencyBrandedReportDraft(agencyBrandedReportDraftSchema.parse(body));
    return { dryRun: true, report, codexNote: 'Codex must derive branded reports from approved tenant-scoped report records and hide private data.' };
  });
}
