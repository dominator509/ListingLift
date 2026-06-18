import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { checkFiverrWorkflowSafety } from '@/server/services/fiverr-workflow-safety-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ safety: checkFiverrWorkflowSafety(body) });
  } catch (error) {
    return mapServiceError(error);
  }
}
