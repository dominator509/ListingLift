import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { previewGalleryRequestSchema } from '@/schemas/preview';
import { buildAdminPreviewGallery } from '@/server/services/preview-gallery-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');
    const body = previewGalleryRequestSchema.parse({ ...(await parseJson(request, {})), jobId: (await params).jobId, organizationId: session.organizationId });
    return jsonOk({ gallery: buildAdminPreviewGallery(body), note: 'Dry-run preview gallery. Codex must replace provided processedFiles with tenant-scoped Prisma lookup.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
