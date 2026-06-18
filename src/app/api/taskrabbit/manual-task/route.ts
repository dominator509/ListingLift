import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { taskrabbitManualTaskInputSchema } from '@/schemas/taskrabbit';
import { createTaskrabbitManualTaskPlan } from '@/server/services/taskrabbit-task-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = taskrabbitManualTaskInputSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    const plan = createTaskrabbitManualTaskPlan(input);
    return jsonOk({ plan, note: 'Seed dry-run route. Codex must create ExternalOrder, Client, Job, UploadToken, TaskrabbitWorkflowEvent, and AuditLog rows transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
