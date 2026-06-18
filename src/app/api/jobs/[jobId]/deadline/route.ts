import { jobDeadlineUpdateSchema } from '@/schemas/job';
import { guardedPatch, parseJson } from '@/server/routes/route-helpers';
import { summarizeJobDeadline } from '@/server/services/job-deadline-service';

export async function PATCH(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return guardedPatch(request, 'manage:jobs', async () => {
    const { jobId } = await context.params;
    const body = await parseJson<unknown>(request, {});
    const input = jobDeadlineUpdateSchema.parse(body);
    const summary = summarizeJobDeadline({ deadline: input.deadline, priority: input.priority ?? 'NORMAL' });
    return { jobId, input, summary, persistence: 'dry-run until Codex persists deadline/priority with audit log' };
  });
}
