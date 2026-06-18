import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';

import { outputApprovalSchema } from '@/schemas/manual-approval';
import { buildOutputApprovalDecision } from '@/server/services/output-approval-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';

export async function POST(request: Request, { params }: { params: Promise<{ processedFileId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'approve:outputs');

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const jobId = new URL(request.url).searchParams.get('jobId');
    const payload = outputApprovalSchema.parse({ ...(await parseJson(request, {})), processedFileId: (await params).processedFileId, decision: 'REJECT_OUTPUT' });
    const result = { outputRejection: buildOutputApprovalDecision(payload, { organizationId: session.organizationId, jobId, actorUserId: session.userId }), note: 'Output rejection with idempotency guard.' };
    await storeIdempotency(request, session, 200, result);
    return jsonOk(result);
  } catch (error) { return mapServiceError(error); }
}
