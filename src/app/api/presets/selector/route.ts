import { jsonOk } from '@/lib/api-response';
import { buildPresetSelector } from '@/server/services/preset-service';
import { parseJson } from '@/server/routes/route-helpers';

export async function POST(request: Request) {
  const body = await parseJson(request, {});
  return jsonOk(buildPresetSelector(body));
}
