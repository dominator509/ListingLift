import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { upworkOfferMappingSchema } from '@/schemas/upwork';
import { listDefaultUpworkOfferMappings, validateUpworkOfferMappingDraft } from '@/server/services/upwork-package-mapping-service';

export async function GET() {
  return jsonOk({ mappings: listDefaultUpworkOfferMappings(), note: 'Seed default mappings. Codex must persist organization-scoped overrides.' });
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const mapping = validateUpworkOfferMappingDraft(upworkOfferMappingSchema.parse(body));
    return jsonOk({ mapping, note: 'Seed validation route. Codex must persist mapping with manage:sales-channels permission and audit logging.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
