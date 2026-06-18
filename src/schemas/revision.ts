import { z } from 'zod';

export const revisionRequestCreateSchema = z.object({
  jobId: z.string().min(1),
  notes: z.string().min(5).max(5000),
});

export const revisionStatusSchema = z.enum(['open', 'accepted', 'in_progress', 'resolved', 'rejected']);

export type RevisionRequestCreateInput = z.infer<typeof revisionRequestCreateSchema>;
export type RevisionStatus = z.infer<typeof revisionStatusSchema>;
