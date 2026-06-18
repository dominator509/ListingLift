import { z } from 'zod';

export const agencyBrandSettingsSchema = z.object({
  portalName: z.string().trim().min(2).max(80).optional(),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  supportEmail: z.string().email().optional(),
  customDomain: z.string().trim().min(3).optional(),
  hideListingLiftBranding: z.boolean().optional(),
  deliveryFooter: z.string().max(1000).optional(),
});

export const agencyClientFilterSchema = z.object({
  status: z.enum(['LEAD', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  search: z.string().trim().max(100).optional(),
});

export type AgencyBrandSettingsInput = z.infer<typeof agencyBrandSettingsSchema>;
export type AgencyClientFilterInput = z.infer<typeof agencyClientFilterSchema>;
