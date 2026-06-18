import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

import { approvalReadinessSchema, manualJobApprovalSchema } from '@/schemas/manual-approval';
import { buildApprovalReadiness } from '@/server/services/approval-readiness-service';
import { buildManualApprovalDecision } from '@/server/services/manual-approval-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';

export async function GET(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    assertPermission(session, 'review:outputs');
    return jsonOk({ jobId: (await params).jobId, note: 'Dry-run approval snapshot. Codex must load approval gate, revisions, flags, and output statuses from Prisma.', organizationId: session.organizationId });
  } catch (error) { return mapServiceError(error); }
}

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

    const body = await parseJson<Record<string, unknown>>(request, {});
    const readiness = approvalReadinessSchema.parse({ ...(body.readiness ?? {}), jobId: (await params).jobId });
    const payload = manualJobApprovalSchema.parse({ ...body, jobId: (await params).jobId, readiness });
    const result = {
      readiness: buildApprovalReadiness(readiness, { organizationId: session.organizationId, actorUserId: session.userId }),
      decision: buildManualApprovalDecision(payload, { organizationId: session.organizationId, actorUserId: session.userId }),
    };

    // Store idempotency result
    await storeIdempotency(request, session, 200, result);

    return jsonOk(result);
  } catch (error) { return mapServiceError(error); }
}
