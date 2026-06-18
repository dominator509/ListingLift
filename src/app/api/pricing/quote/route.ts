import { jsonOk, mapServiceError } from '@/lib/api-response';
import { buildPackageQuote } from '@/server/services/pricing-service';
import { parseJson } from '@/server/routes/route-helpers';

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, {});
    return jsonOk(buildPackageQuote(body as never));
  } catch (error) {
    return mapServiceError(error);
  }
}
