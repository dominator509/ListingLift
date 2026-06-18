import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { fiverrManualOrderInputSchema } from '@/schemas/fiverr';
import { createFiverrManualOrderPlan } from '@/server/services/fiverr-order-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = fiverrManualOrderInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    const plan = createFiverrManualOrderPlan(input);
    return jsonOk({ plan, note: 'Seed dry-run route. Codex must create ExternalOrder, Client, Job, UploadToken, AuditLog rows transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
