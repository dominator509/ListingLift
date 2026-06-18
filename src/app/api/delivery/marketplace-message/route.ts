import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { marketplaceDeliveryMessageSchema } from '@/schemas/delivery-notification';
import { buildMarketplaceMessagePreview } from '@/server/services/marketplace-delivery-message-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'send:delivery');
    const body = marketplaceDeliveryMessageSchema.parse(await parseJson(request, {}));
    return jsonOk(buildMarketplaceMessagePreview(body));
  } catch (error) {
    return mapServiceError(error);
  }
}
