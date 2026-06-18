import { z } from 'zod';

export const organizationTypeSchema = z.enum(['PLATFORM', 'AGENCY', 'SELLER', 'CLIENT_WORKSPACE']);

export const organizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  organizationType: organizationTypeSchema.default('SELLER'),
  parentOrganizationId: z.string().min(1).optional(),
});

export const membershipRoleSchema = z.enum([
  'SUPER_ADMIN',
  'OPERATOR',
  'AGENCY_ADMIN',
  'CLIENT_OWNER',
  'CLIENT_VIEWER',
  'FULFILLMENT_REVIEWER',
  'DESIGNER_EDITOR',
  'BILLING_MANAGER',
]);

export type OrganizationInput = z.infer<typeof organizationSchema>;
export type OrganizationTypeInput = z.infer<typeof organizationTypeSchema>;
export type MembershipRoleInput = z.infer<typeof membershipRoleSchema>;
