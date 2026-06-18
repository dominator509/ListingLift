import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { upworkRetainerReminderInputSchema } from '@/schemas/upwork';
import { assertUpworkMessageSafe, buildUpworkRetainerReminderDraft } from '@/server/services/upwork-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = upworkRetainerReminderInputSchema.parse(body);
    const draft = buildUpworkRetainerReminderDraft(input);
    return jsonOk({ draft, safety: assertUpworkMessageSafe(draft.message), note: 'Retainer reminder is a manual operator prompt, not automated Upwork messaging.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
