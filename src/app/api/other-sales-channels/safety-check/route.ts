import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { genericChannelSafetyCheckSchema } from '@/schemas/generic-sales-channels';
import { checkGenericSalesChannelSafety } from '@/server/services/generic-channel-safety-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ safety: checkGenericSalesChannelSafety(genericChannelSafetyCheckSchema.parse(body)) });
  } catch (error) {
    return mapServiceError(error);
  }
}
