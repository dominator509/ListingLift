import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { upworkProposalTemplateInputSchema } from '@/schemas/upwork';
import { assertUpworkMessageSafe, buildUpworkProposalTemplateDraft } from '@/server/services/upwork-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = upworkProposalTemplateInputSchema.parse(body);
    const draft = buildUpworkProposalTemplateDraft(input);
    return jsonOk({ draft, safety: assertUpworkMessageSafe(draft.message), note: 'Operator may manually adapt proposal copy inside Upwork. No automated proposal submission.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
