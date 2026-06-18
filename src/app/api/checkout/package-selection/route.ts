import { jsonOk, mapServiceError } from '@/lib/api-response';
import { buildCheckoutEntryDraft } from '@/server/services/checkout-entry-service';
import { parseJson } from '@/server/routes/route-helpers';

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, {});
    return jsonOk(buildCheckoutEntryDraft(body as never), { status: 201 });
  } catch (error) {
    return mapServiceError(error);
  }
}
