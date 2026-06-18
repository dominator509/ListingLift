import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { createQualityFlagSchema } from '@/schemas/quality-control';
import { buildQualityFlagDraft } from '@/server/services/quality-flagging-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';

export async function POST(request: Request, { params }: { params: Promise<{ processedFileId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const payload = createQualityFlagSchema.parse({ ...(await parseJson(request, {})), processedFileId: (await params).processedFileId });
    const jobId = new URL(request.url).searchParams.get('jobId') ?? 'dry-run-job-id';
    const result = {
      flag: buildQualityFlagDraft(payload, { organizationId: session.organizationId, jobId, actorUserId: session.userId }),
      note: 'Quality flag with idempotency guard.',
    };
    await storeIdempotency(request, session, 201, result);
    return jsonOk(result, { status: 201 });
  } catch (error) {
    return mapServiceError(error);
  }
}
