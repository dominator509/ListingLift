import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';

import { updateRevisionStatusSchema } from '@/schemas/manual-approval';
import { buildRevisionStatusUpdate } from '@/server/services/revision-workflow-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';

export async function POST(request: Request, { params }: { params: Promise<{ revisionId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'manage:jobs');

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const payload = updateRevisionStatusSchema.parse({ ...(await parseJson(request, {})), revisionId: (await params).revisionId });
    const result = { revisionStatusUpdate: buildRevisionStatusUpdate(payload, { organizationId: session.organizationId, actorUserId: session.userId }), note: 'Revision status update with idempotency guard.' };
    await storeIdempotency(request, session, 200, result);
    return jsonOk(result);
  } catch (error) { return mapServiceError(error); }
}
