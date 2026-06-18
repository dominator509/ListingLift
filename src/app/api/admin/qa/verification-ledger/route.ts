import { PERMISSIONS } from '@/domain/permissions';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { qaVerificationLedgerDraftSchema } from '@/schemas/full-testing-qa';
import { buildQaVerificationLedgerDraft, summarizeQaLedgerStatuses } from '@/server/services/full-testing-qa-verification-ledger-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageQa);
    return {
      summary: summarizeQaLedgerStatuses(),
      records: [],
      codexNote: 'No persisted QA ledger records exist in this scaffold. Codex must wire Prisma-backed QA run/result evidence for organization ' + session.organizationId + '.',
    };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageQa);
    const body = await parseJson(request, {});
    const parsed = qaVerificationLedgerDraftSchema.parse({ ...(typeof body === 'object' && body !== null ? body : {}), organizationId: session.organizationId, userId: session.userId });
    return {
      draft: await buildQaVerificationLedgerDraft(parsed),
      codexNote: 'Ledger draft only. Codex must persist sanitized evidence references transactionally and never use this route to fake test results.',
    };
  });
}
