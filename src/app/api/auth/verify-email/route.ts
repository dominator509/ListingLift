import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { verifyEmail } from '@/server/auth/auth-service';
import { authError, authJson } from '@/server/auth/route-utils';

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = verifyEmailSchema.parse(await request.json());
    await verifyEmail(body.token);
    return authJson({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    return authError(error);
  }
}
