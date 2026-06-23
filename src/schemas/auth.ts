import { z } from 'zod';
import type { RoleKey } from '@/domain/permissions';

export interface AccountSettingsInput {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface SessionContext {
  userId: string;
  organizationId: string;
  role: RoleKey;
  organizationType?: string;
  clientId?: string | null;
  agencyScope?: boolean | null;
  tokenHash?: string;
}

export const signupSchema = z.object({
  email: z.string().email('Invalid email address').max(254, 'Email must be at most 254 characters'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  name: z.string().min(1, 'Name is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const accountSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  currentPassword: z.string().min(1, 'Current password is required').optional(),
  newPassword: z.string().min(12, 'New password must be at least 12 characters').optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
