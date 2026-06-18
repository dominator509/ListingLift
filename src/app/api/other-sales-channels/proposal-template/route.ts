import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { genericProposalTemplateInputSchema } from '@/schemas/generic-sales-channels';
import { createGenericProposalTemplate } from '@/server/services/generic-channel-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ template: createGenericProposalTemplate(genericProposalTemplateInputSchema.parse(body)) });
  } catch (error) {
    return mapServiceError(error);
  }
}
