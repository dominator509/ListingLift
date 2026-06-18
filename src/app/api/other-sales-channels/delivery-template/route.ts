import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createGenericDeliveryTemplate } from '@/server/services/generic-channel-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ template: createGenericDeliveryTemplate({ channelKey: String(body.channelKey ?? 'Freelancer'), buyerName: typeof body.buyerName === 'string' ? body.buyerName : undefined, archiveFileName: typeof body.archiveFileName === 'string' ? body.archiveFileName : undefined, externalLinkAllowed: body.externalLinkAllowed === true }) });
  } catch (error) {
    return mapServiceError(error);
  }
}
