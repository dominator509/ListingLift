import { type NextRequest } from 'next/server';
import { signupSchema } from '@/schemas/auth';
import { signup } from '@/server/auth/auth-service';
import { authError, authJson, requestAuthMeta } from '@/server/auth/route-utils';

export async function POST(request: NextRequest) {
  try {
    const body = signupSchema.parse(await request.json());
    const meta = requestAuthMeta(request);
    const result = await signup(body, meta);
    return authJson({
      user: result.user,
      verificationToken: result.verificationToken,
      emailVerificationRequired: result.emailVerificationRequired,
      // In production, verificationToken would be emailed, not returned
    }, 201);
  } catch (error) {
    return authError(error);
  }
}
