import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { gumroadSalePayloadSchema } from '@/schemas/gumroad';
import { resolveGumroadOfferMapping, buildGumroadProductMappingAuditNote } from '@/server/services/gumroad-product-mapping-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const payload = gumroadSalePayloadSchema.parse(body.payload ?? body);
    const result = resolveGumroadOfferMapping(payload);
    return jsonOk({ result, auditNote: buildGumroadProductMappingAuditNote(result) });
  } catch (error) {
    return mapServiceError(error);
  }
}
