import { jsonOk } from '@/lib/api-response';
import { validatePresetCatalogForAdmin } from '@/server/services/preset-service';

export async function GET() {
  return jsonOk(validatePresetCatalogForAdmin());
}
