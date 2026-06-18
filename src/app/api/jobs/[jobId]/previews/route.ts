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
    return jsonOk({ gallery: buildAdminPreviewGallery(body), note: 'Job preview contract route. Codex must enforce tenant isolation and return persisted preview metadata.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
