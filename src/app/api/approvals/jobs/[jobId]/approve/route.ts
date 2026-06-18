import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';

import { manualJobApprovalSchema } from '@/schemas/manual-approval';
import { buildManualApprovalDecision } from '@/server/services/manual-approval-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'approve:outputs');

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const payload = manualJobApprovalSchema.parse({ ...(await parseJson(request, {})), jobId: (await params).jobId, decision: 'APPROVE_JOB' });
    const result = { approval: buildManualApprovalDecision(payload, { organizationId: session.organizationId, actorUserId: session.userId }), note: 'Admin approval with idempotency guard.' };
    await storeIdempotency(request, session, 200, result);
    return jsonOk(result);
  } catch (error) { return mapServiceError(error); }
}
