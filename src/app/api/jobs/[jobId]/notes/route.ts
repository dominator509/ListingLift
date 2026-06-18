import { jobAdminNoteSchema } from '@/schemas/job';
import { guardedPost, parseJson } from '@/server/routes/route-helpers';
import { buildJobAdminNoteDraft } from '@/server/services/job-admin-note-service';

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return guardedPost(request, 'manage:jobs', async () => {
    const { jobId } = await context.params;
    const body = await parseJson<unknown>(request, {});
    const input = jobAdminNoteSchema.parse(body);
    return { jobId, note: buildJobAdminNoteDraft(input), persistence: 'dry-run until Codex persists Job admin/client-visible notes and AuditLog' };
  });
}
