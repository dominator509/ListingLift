import { PERMISSIONS } from '@/domain/permissions';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { buildQaCommandSequence } from '@/server/services/full-testing-qa-plan-service';
import { getQaProductionBlockers } from '@/server/services/full-testing-qa-risk-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageQa);
    return {
      commandSequence: buildQaCommandSequence(),
      stopConditions: getQaProductionBlockers('HIGH'),
      requiredDocsToUpdate: ['CODEX_GAPS.md', 'ROADMAP_STATUS.md', 'PHASE_38_VERIFICATION_MATRIX.md', 'TESTING.md', 'docs/full-testing-qa-phase38-gap-handoff.md'],
      codexNote: 'Runbook is scaffold-only. Codex must execute commands in order and stop on failures for organization ' + session.organizationId + '.',
    };
  });
}
