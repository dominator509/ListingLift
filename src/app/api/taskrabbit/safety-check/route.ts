import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { evaluateTaskrabbitWorkflowSafety } from '@/server/services/taskrabbit-workflow-safety-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk(evaluateTaskrabbitWorkflowSafety(body));
  } catch (error) {
    return mapServiceError(error);
  }
}
