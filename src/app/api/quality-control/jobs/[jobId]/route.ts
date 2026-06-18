import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { qualityReviewRequestSchema } from '@/schemas/quality-control';
import { buildJobQualityReview } from '@/server/services/quality-review-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');
    const body = qualityReviewRequestSchema.parse({ ...(await parseJson(request, {})), jobId: (await params).jobId, organizationId: session.organizationId });
    return jsonOk({
      qualityReview: buildJobQualityReview({ organizationId: session.organizationId, jobId: (await params).jobId, outputs: body.outputs, actorUserId: session.userId }),
      note: 'Dry-run QC. Codex must replace request-provided outputs with tenant-scoped Prisma ProcessedFile and PreviewGalleryItem lookups.',
    });
  } catch (error) {
    return mapServiceError(error);
  }
}
