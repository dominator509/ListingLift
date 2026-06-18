import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { deliveryEmailPreviewSchema } from '@/schemas/delivery-notification';
import { buildDeliveryEmailPreview } from '@/server/services/delivery-email-template-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'send:delivery');
    const body = deliveryEmailPreviewSchema.parse({ ...(await parseJson(request, {})), jobId: (await params).jobId });
    return jsonOk(buildDeliveryEmailPreview(body));
  } catch (error) {
    return mapServiceError(error);
  }
}
