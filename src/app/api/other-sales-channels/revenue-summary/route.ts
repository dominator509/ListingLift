import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { summarizeGenericChannelRevenue } from '@/server/services/generic-channel-revenue-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<{ rows?: Array<{ channelKey: string; amountCents?: number; currency?: string }> }>(request, {});
    return jsonOk({ summary: summarizeGenericChannelRevenue(body.rows ?? []) });
  } catch (error) {
    return mapServiceError(error);
  }
}
