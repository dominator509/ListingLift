import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { socialCommerceMappingInputSchema } from '@/schemas/social-commerce';
import { buildSocialCommerceMappingDraft, listSocialCommerceChannelMappings } from '@/server/services/social-commerce-channel-mapping-service';

export async function GET() {
  return jsonOk({ mappings: listSocialCommerceChannelMappings() });
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ mappingDraft: buildSocialCommerceMappingDraft(socialCommerceMappingInputSchema.parse(body)) }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
