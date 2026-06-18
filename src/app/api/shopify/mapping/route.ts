import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildShopifyPackageMappingTable } from '@/server/services/shopify-package-mapping-service';

export async function GET() {
  return jsonOk({ mappings: buildShopifyPackageMappingTable(), note: 'Seed mapping catalog. Codex must persist org-scoped Shopify mapping rows.' });
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ draft: body, note: 'Seed dry-run route. Codex must validate, persist, and audit Shopify mapping changes with manage:sales-channels permission.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
