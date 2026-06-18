import { agencyWhiteLabelEventSchema } from '@/schemas/agency-white-label';
import { guardedSession, parseJson } from '@/server/routes/route-helpers';
import { assertAgencyWhiteLabelAccess } from '@/server/services/agency-white-label-access-service';
import { buildAgencyWhiteLabelEventDraft } from '@/server/services/agency-white-label-event-service';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertAgencyWhiteLabelAccess(session);
    const body = await parseJson(request, {});
    const event = buildAgencyWhiteLabelEventDraft({ ...agencyWhiteLabelEventSchema.parse(body), organizationId: session.organizationId, userId: session.userId });
    return { dryRun: true, event, codexNote: 'Codex must persist agency events and audit sensitive white-label actions.' };
  });
}
