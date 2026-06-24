import { PERMISSIONS } from '@/domain/permissions';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { qaVerificationLedgerDraftSchema } from '@/schemas/full-testing-qa';
import { buildQaVerificationLedgerDraft, getQaVerificationLedgerSummary } from '@/server/services/full-testing-qa-verification-ledger-service';

export async function GET(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageQa);
    const ledger = await getQaVerificationLedgerSummary(session.organizationId);
    return {
      summary: {
        total: ledger.total,
        passed: ledger.passed,
        failed: ledger.failed,
        blocked: ledger.blocked,
        notRun: ledger.notRun,
        productionReady: ledger.productionReady,
      },
      records: ledger.records,
      persisted: true,
      codexNote: 'QA ledger records are loaded from Prisma for organization ' + session.organizationId + '. PASS rows still require evidence references and never imply production readiness by themselves.',
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
      codexNote: 'Ledger entry persisted with sanitized evidence references. This route rejects fake PASS claims and never marks production readiness by itself.',
    };
  });
}
