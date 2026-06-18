import { z } from 'zod';
import { membershipRoleSchema } from '@/schemas/organization';

export const permissionKeySchema = z.string().min(3);

export const rbacCheckSchema = z.object({
  permission: permissionKeySchema,
  organizationId: z.string().min(1),
  clientId: z.string().min(1).optional(),
  jobId: z.string().min(1).optional(),
});

export const teamInviteSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(2).optional(),
  roleKey: membershipRoleSchema,
  clientId: z.string().min(1).optional(),
  agencyScope: z.boolean().default(false),
});

export const membershipUpdateSchema = z.object({
  membershipId: z.string().min(1),
  roleKey: membershipRoleSchema,
  clientId: z.string().min(1).nullable().optional(),
  agencyScope: z.boolean().optional(),
});

export type RbacCheckInput = z.infer<typeof rbacCheckSchema>;
export type TeamInviteInput = z.infer<typeof teamInviteSchema>;
export type MembershipUpdateInput = z.infer<typeof membershipUpdateSchema>;
