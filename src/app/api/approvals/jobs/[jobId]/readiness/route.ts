import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';

import { approvalReadinessSchema } from '@/schemas/manual-approval';
import { buildApprovalReadiness } from '@/server/services/approval-readiness-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');
    const payload = approvalReadinessSchema.parse({ ...(await parseJson(request, {})), jobId: (await params).jobId });
    return jsonOk({ readiness: buildApprovalReadiness(payload, { organizationId: session.organizationId, actorUserId: session.userId }), note: 'Dry-run approval readiness. Codex must replace request-provided counts with tenant-scoped Prisma counts.' });
  } catch (error) { return mapServiceError(error); }
}
