import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { gumroadPurchaseIntakeRequestSchema } from '@/schemas/gumroad';
import { createGumroadPurchaseIntakePlan } from '@/server/services/gumroad-purchase-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = gumroadPurchaseIntakeRequestSchema.parse({ ...body, payload: body.payload ?? body, dryRun: body.dryRun ?? true });
    const plan = createGumroadPurchaseIntakePlan(input);
    return jsonOk({ plan, note: 'Seed dry-run route. Codex must use Prisma transactions for real intake.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
