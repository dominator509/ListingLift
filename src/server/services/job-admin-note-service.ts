import { safeAdminQueueNote } from '@/domain/job-queue';
import type { JobAdminNoteInput } from '@/schemas/job';

export type JobAdminNoteDraft = {
  note: string;
  visibility: 'INTERNAL' | 'CLIENT_VISIBLE';
  auditAction: 'job_admin_note_added' | 'job_client_visible_note_added';
};

export function buildJobAdminNoteDraft(input: JobAdminNoteInput): JobAdminNoteDraft {
  const note = safeAdminQueueNote(input.note);
  if (!note) throw new Error('Admin note cannot be empty after sanitization.');
  return {
    note,
    visibility: input.visibility,
    auditAction: input.visibility === 'CLIENT_VISIBLE' ? 'job_client_visible_note_added' : 'job_admin_note_added',
  };
}
