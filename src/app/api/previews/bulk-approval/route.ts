import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission, assertProcessedFilesAuthorization } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { bulkPreviewApprovalRequestSchema } from '@/schemas/preview';
import { buildBulkPreviewApprovalPlan } from '@/server/services/bulk-preview-approval-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'approve:outputs');

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const body = bulkPreviewApprovalRequestSchema.parse(await parseJson(request, {}));

    // P20: Per-item authorization — verify all selected files belong to session's org
    await assertProcessedFilesAuthorization(session, body.selectedProcessedFileIds);

    const result = {
      plan: buildBulkPreviewApprovalPlan({ ...body, organizationId: session.organizationId, actorUserId: session.userId }),
      note: 'Bulk preview approval with per-item authorization enforced.',
    };

    await storeIdempotency(request, session, 200, result);

    return jsonOk(result);
  } catch (error) {
    return mapServiceError(error);
  }
}
