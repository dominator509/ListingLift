import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createSocialCommerceRevisionStatusDraft } from '@/server/services/social-commerce-revision-workflow-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ revisionDraft: createSocialCommerceRevisionStatusDraft(body) }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
