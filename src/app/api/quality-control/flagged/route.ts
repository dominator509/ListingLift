import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { qualityReviewRequestSchema } from '@/schemas/quality-control';
import { buildFlaggedOutputQueue } from '@/server/services/flagged-output-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');
    const body = qualityReviewRequestSchema.parse({ ...(await parseJson(request, {})), organizationId: session.organizationId });
    return jsonOk({
      flaggedQueue: buildFlaggedOutputQueue({ organizationId: session.organizationId, jobId: body.jobId, outputs: body.outputs }),
      note: 'Dry-run flagged-output queue. Codex must query flagged output records server-side.',
    });
  } catch (error) {
    return mapServiceError(error);
  }
}
