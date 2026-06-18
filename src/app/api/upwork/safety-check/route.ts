import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { evaluateUpworkWorkflowSafety } from '@/server/services/upwork-workflow-safety-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ safety: evaluateUpworkWorkflowSafety(body) });
  } catch (error) {
    return mapServiceError(error);
  }
}
