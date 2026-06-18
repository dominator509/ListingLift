import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { taskrabbitConversionUpdateSchema } from '@/schemas/taskrabbit';
import { createTaskrabbitConversionUpdatePlan } from '@/server/services/taskrabbit-conversion-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = taskrabbitConversionUpdateSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ plan: createTaskrabbitConversionUpdatePlan(input), note: 'Dry-run conversion update. Codex must persist TaskrabbitWorkflowEvent and AuditLog transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
