import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { upworkManualContractInputSchema } from '@/schemas/upwork';
import { createUpworkManualContractPlan } from '@/server/services/upwork-contract-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = upworkManualContractInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    const plan = createUpworkManualContractPlan(input);
    return jsonOk({ plan, note: 'Seed dry-run route. Codex must create ExternalOrder, Client, Job, UploadToken, UpworkWorkflowEvent, and AuditLog rows transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
