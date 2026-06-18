import { PERMISSIONS } from '@/domain/permissions';
import { qaDashboardQuerySchema } from '@/schemas/full-testing-qa';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildFullTestingQaDashboardSnapshot } from '@/server/services/full-testing-qa-dashboard-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageQa);
    const query = qaDashboardQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const snapshot = buildFullTestingQaDashboardSnapshot();
    return {
      ...snapshot,
      query,
      commandSequence: query.layer ? snapshot.commandSequence.filter((command) => command.layer === query.layer) : snapshot.commandSequence,
      coverage: query.layer ? snapshot.coverage.filter((item) => item.layer === query.layer) : snapshot.coverage,
      codexNote: 'Dry-run QA dashboard for organization ' + session.organizationId + '. Codex must run commands and attach evidence before marking any check PASS.',
    };
  });
}
