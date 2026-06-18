import { z } from 'zod';

export const clientCreateSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(2),
  businessName: z.string().optional(),
  email: z.string().email().optional(),
  sourceChannel: z.string().optional(),
  assignedAdminUserId: z.string().min(1).optional(),
  status: z.enum(['LEAD', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
});

export const clientUpdateSchema = clientCreateSchema.partial().extend({
  id: z.string().min(1),
  organizationId: z.string().min(1),
});

export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
