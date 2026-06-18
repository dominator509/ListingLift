import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { resolveQualityFlagSchema } from '@/schemas/quality-control';
import { buildQualityFlagResolutionDraft } from '@/server/services/quality-flagging-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';

export async function POST(request: Request, { params }: { params: Promise<{ flagId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const payload = resolveQualityFlagSchema.parse({ ...(await parseJson(request, {})), flagId: (await params).flagId });
    const jobId = new URL(request.url).searchParams.get('jobId') ?? 'dry-run-job-id';
    const result = {
      resolution: buildQualityFlagResolutionDraft(payload, { organizationId: session.organizationId, jobId, actorUserId: session.userId }),
      note: 'Flag resolution with idempotency guard.',
    };
    await storeIdempotency(request, session, 200, result);
    return jsonOk(result);
  } catch (error) {
    return mapServiceError(error);
  }
}
