import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';
import { previewImageDetailRequestSchema } from '@/schemas/preview';
import { buildImageDetailPreview } from '@/server/services/image-detail-preview-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request, { params }: { params: Promise<{ processedFileId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');
    const body = previewImageDetailRequestSchema.parse({ ...(await parseJson(request, {})), processedFileId: (await params).processedFileId });
    return jsonOk({ detail: buildImageDetailPreview(body), note: 'Dry-run detail route. Codex must query ProcessedFile/Image by organization and job.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
