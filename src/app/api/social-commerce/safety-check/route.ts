import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { evaluateSocialCommerceSafety } from '@/server/services/social-commerce-workflow-safety-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ safety: evaluateSocialCommerceSafety(body) }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
