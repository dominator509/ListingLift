import { jsonOk, jsonFail, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission, assertProcessedFilesAuthorization } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { bulkQualityReviewSchema } from '@/schemas/quality-control';
import { buildBulkQualityReviewDraft } from '@/server/services/quality-review-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const payload = bulkQualityReviewSchema.parse(await parseJson(request, {}));

    // P20: Per-item authorization — verify all processed files belong to session's org
    await assertProcessedFilesAuthorization(session, payload.processedFileIds);

    const result = {
      bulkReview: buildBulkQualityReviewDraft(payload, { organizationId: session.organizationId, actorUserId: session.userId }),
      note: 'Bulk QC review with per-item authorization enforced.',
    };

    await storeIdempotency(request, session, 200, result);

    return jsonOk(result);
  } catch (error) {
    return mapServiceError(error);
  }
}
