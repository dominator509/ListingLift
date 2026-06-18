import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { taskrabbitDeliveryMessageInputSchema } from '@/schemas/taskrabbit';
import { createTaskrabbitDeliveryMessage } from '@/server/services/taskrabbit-delivery-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = taskrabbitDeliveryMessageInputSchema.parse(body);
    return jsonOk(createTaskrabbitDeliveryMessage(input));
  } catch (error) {
    return mapServiceError(error);
  }
}
