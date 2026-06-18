import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { etsyListingImportInputSchema } from '@/schemas/etsy';
import { createEtsyListingImportPlan } from '@/server/services/etsy-listing-import-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = etsyListingImportInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createEtsyListingImportPlan(input), note: 'Seed import planner. Codex must wire CSV/API import rows to tenant-scoped Etsy listing metadata and jobs.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
