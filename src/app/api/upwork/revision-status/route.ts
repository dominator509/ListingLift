import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { upworkRevisionUpdateSchema } from '@/schemas/upwork';
import { createUpworkRevisionStatusPlan } from '@/server/services/upwork-revision-workflow-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = upworkRevisionUpdateSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    const plan = createUpworkRevisionStatusPlan(input);
    return jsonOk({ plan, note: 'Seed dry-run route. Codex must update RevisionRequest, UpworkWorkflowEvent, Job, and AuditLog transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
