import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { fiverrGigMappingSchema } from '@/schemas/fiverr';
import type { FiverrGigMapping } from '@/domain/fiverr';
import { buildFiverrMappingUpsertDraft, listFiverrGigMappings, resolveFiverrGigMapping } from '@/server/services/fiverr-package-mapping-service';

export async function GET() {
  return jsonOk({ mappings: listFiverrGigMappings(), note: 'Seed route. Codex must back this with organization-scoped FiverrGigMapping rows.' });
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    if (body.gigTitle || body.packagePurchased || body.tierKey) {
      return jsonOk({ resolution: resolveFiverrGigMapping(body), note: 'Seed mapping resolution.' });
    }
    const mapping = fiverrGigMappingSchema.parse(body);
    return jsonOk({ draft: buildFiverrMappingUpsertDraft(mapping as FiverrGigMapping), note: 'Seed route. Codex must require manage:sales-channels and audit mapping mutations.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
