import { jobStatusSchema, jobStatusTransitionSchema } from '@/schemas/job';
import { guardedPatch, parseJson } from '@/server/routes/route-helpers';
import { buildJobTransitionDraft, assertStatusTransitionCanExposeDelivery } from '@/server/services/job-status-transition-service';

export async function PATCH(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return guardedPatch(request, 'manage:jobs', async () => {
    const { jobId } = await context.params;
    const body = await parseJson<unknown>(request, {});
    const transition = jobStatusTransitionSchema.parse(body);
    const currentStatus = jobStatusSchema.parse(typeof body === 'object' && body && 'currentStatus' in body ? (body as { currentStatus?: unknown }).currentStatus : 'WAITING_FOR_UPLOAD');
    const draft = buildJobTransitionDraft({ currentStatus, transition });
    assertStatusTransitionCanExposeDelivery({ nextStatus: transition.nextStatus, approvedAt: typeof body === 'object' && body && 'approvedAt' in body ? (body as { approvedAt?: string }).approvedAt : null });
    return { jobId, draft, persistence: 'dry-run until Codex persists Job status and AuditLog in one transaction' };
  });
}
