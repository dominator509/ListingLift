import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { fiverrDeliveryTemplateInputSchema } from '@/schemas/fiverr';
import { assertFiverrDeliveryMessageSafe, buildFiverrDeliveryTemplateDraft } from '@/server/services/fiverr-delivery-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = fiverrDeliveryTemplateInputSchema.parse(body);
    const draft = buildFiverrDeliveryTemplateDraft(input);
    return jsonOk({ draft, safety: assertFiverrDeliveryMessageSafe(draft.message), note: 'Operator must deliver through Fiverr manually unless approved integration exists.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
