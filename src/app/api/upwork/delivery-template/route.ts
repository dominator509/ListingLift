import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { upworkDeliveryTemplateInputSchema } from '@/schemas/upwork';
import { assertUpworkMessageSafe, buildUpworkDeliveryTemplateDraft } from '@/server/services/upwork-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = upworkDeliveryTemplateInputSchema.parse(body);
    const draft = buildUpworkDeliveryTemplateDraft(input);
    return jsonOk({ draft, safety: assertUpworkMessageSafe(draft.message), note: 'Operator must deliver through Upwork manually unless approved integration exists.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
