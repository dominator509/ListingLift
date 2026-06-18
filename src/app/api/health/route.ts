import { getEnv } from '@/lib/env';

export async function GET() {
  const env = getEnv();
  return Response.json({
    ok: true,
    service: 'listinglift',
    mode: process.env.NODE_ENV ?? 'development',
    realIntegrationsEnabled: env.REAL_INTEGRATIONS_ENABLED,
    realImageProviderCallsEnabled: env.REAL_IMAGE_PROVIDER_CALLS_ENABLED,
  });
}
