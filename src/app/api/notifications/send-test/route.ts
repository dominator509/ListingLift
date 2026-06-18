import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { notificationSendSchema } from '@/schemas/delivery-notification';
import { sendDeliveryNotification } from '@/server/services/delivery-notification-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'manage:integrations');
    const body = notificationSendSchema.parse(await parseJson(request, {}));
    return jsonOk(await sendDeliveryNotification({ ...body, dryRun: true }));
  } catch (error) {
    return mapServiceError(error);
  }
}
