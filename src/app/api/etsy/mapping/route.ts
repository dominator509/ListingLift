import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildEtsyPackageMappingTable } from '@/server/services/etsy-package-mapping-service';

export async function GET() {
  return jsonOk({ mappings: buildEtsyPackageMappingTable(), note: 'Seed mapping catalog. Codex must persist org-scoped Etsy mapping rows.' });
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ draft: body, note: 'Seed dry-run route. Codex must validate, persist, and audit Etsy mapping changes with manage:sales-channels permission.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
