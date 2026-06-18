import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { etsySafetyCheckSchema } from '@/schemas/etsy';
import { checkEtsyWorkflowSafety } from '@/server/services/etsy-workflow-safety-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = etsySafetyCheckSchema.parse(body);
    return jsonOk({ safety: checkEtsyWorkflowSafety(input), note: 'Safety planner only. Blocking conditions must prevent persistence/execution in Codex implementation.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
