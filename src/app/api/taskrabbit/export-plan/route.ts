import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { taskrabbitManualTaskInputSchema } from '@/schemas/taskrabbit';
import { createTaskrabbitManualTaskPlan } from '@/server/services/taskrabbit-task-intake-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = taskrabbitManualTaskInputSchema.parse({ ...body, dryRun: true });
    const plan = createTaskrabbitManualTaskPlan(input);
    return jsonOk({ exportPlan: { externalOrder: plan.externalOrderDraft, job: plan.jobDraft, conversion: plan.conversionPlan }, note: 'Operator export plan only. No Taskrabbit private-page scraping.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
