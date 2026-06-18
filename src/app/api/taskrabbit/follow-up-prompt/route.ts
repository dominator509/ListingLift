import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { taskrabbitFollowUpPromptInputSchema } from '@/schemas/taskrabbit';
import { createTaskrabbitFollowUpPrompt } from '@/server/services/taskrabbit-conversion-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = taskrabbitFollowUpPromptInputSchema.parse(body);
    return jsonOk(createTaskrabbitFollowUpPrompt(input));
  } catch (error) {
    return mapServiceError(error);
  }
}
