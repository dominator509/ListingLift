import { config } from 'dotenv';
import { envSchema } from '../src/schemas/env';

config({ path: '.env.test', override: false });
config({ path: '.env' });
config({ path: '.env.local', override: true });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment validation failed:');
  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

if (parsed.data.REAL_INTEGRATIONS_ENABLED || parsed.data.REAL_IMAGE_PROVIDER_CALLS_ENABLED) {
  console.warn('Real integrations/provider calls are enabled. Confirm this is intentional outside local mock development.');
}

console.log('Environment validation passed.');
