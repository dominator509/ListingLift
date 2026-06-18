import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { deliveryDownloadTrackSchema } from '@/schemas/delivery-notification';
import { buildDownloadTrackingEvent } from '@/server/services/delivery-download-tracking-service';

export async function POST(request: Request) {
  try {
    const body = deliveryDownloadTrackSchema.parse(await parseJson(request, {}));
    const event = buildDownloadTrackingEvent(body);
    return jsonOk({ ...event, tokenHash: '[redacted]', note: 'Dry-run tracking only. Codex must persist this with request metadata and increment download counts transactionally.' }, { status: 201 });
  } catch (error) {
    return mapServiceError(error);
  }
}
