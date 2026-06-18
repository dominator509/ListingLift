import { jsonOk } from '@/lib/api-response';
import { listGumroadOfferMappings } from '@/server/services/gumroad-product-mapping-service';

export async function GET() {
  return jsonOk({ provider: 'gumroad', mappings: listGumroadOfferMappings(), note: 'Seed mappings. Codex must persist admin-edited product IDs/permalinks in Prisma.' });
}
