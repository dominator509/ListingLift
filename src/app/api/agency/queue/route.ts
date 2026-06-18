import { agencyBulkQueuePlanSchema, agencyQueueQuerySchema } from '@/schemas/agency-white-label';
import { guardedSession, parseJson } from '@/server/routes/route-helpers';
import { assertCanManageAgencyQueue } from '@/server/services/agency-white-label-access-service';
import { buildAgencyBulkQueuePlan, buildAgencyQueueRows, buildAgencyQueueSummary } from '@/server/services/agency-bulk-queue-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertCanManageAgencyQueue(session);
    const query = agencyQueueQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const items = buildAgencyQueueRows(undefined, query);
    return { dryRun: true, query, summary: buildAgencyQueueSummary(items), items, codexNote: 'Codex must load bulk queue records by agency tenant and never mutate originals.' };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertCanManageAgencyQueue(session);
    const body = await parseJson(request, {});
    const plan = buildAgencyBulkQueuePlan(agencyBulkQueuePlanSchema.parse(body));
    return { dryRun: true, plan, codexNote: 'Codex must persist queue plans transactionally, audit the action, and keep manual approval gates.' };
  });
}
