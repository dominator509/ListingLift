import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { etsyRevisionStatusInputSchema } from '@/schemas/etsy';
import { createEtsyRevisionStatusPlan } from '@/server/services/etsy-revision-workflow-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = etsyRevisionStatusInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createEtsyRevisionStatusPlan(input), note: 'Seed dry-run route. Codex must persist Etsy revision workflow events and block completion while revisions are open.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
