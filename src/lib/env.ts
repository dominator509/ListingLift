const isProduction = () => process.env.NODE_ENV === 'production';

function devFallback(value: string, name: string): string {
  if (isProduction()) {
    throw new Error(`[CRITICAL] ${name} environment variable is required in production. Set ${name} before starting the server.`);
  }
  console.warn(`[env] WARNING: Using dev-only fallback for ${name}. Set ${name} env var for production.`);
  return value;
}

export function getEnv() {
  return {
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    SESSION_SECRET: process.env.SESSION_SECRET ?? devFallback('dev-secret-min-32-chars-long!!!!!!!!!!', 'SESSION_SECRET'),
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? devFallback('dev-encryption-key-16', 'ENCRYPTION_KEY'),
    CSRF_SECRET: process.env.CSRF_SECRET ?? process.env.SESSION_SECRET ?? devFallback('dev-csrf-secret', 'CSRF_SECRET'),
    CSRF_ALLOWED_ORIGINS: process.env.CSRF_ALLOWED_ORIGINS ?? 'http://localhost:3000',
    UPLOAD_TOKEN_SECRET: process.env.UPLOAD_TOKEN_SECRET ?? devFallback('dev-upload-secret', 'UPLOAD_TOKEN_SECRET'),
    DELIVERY_TOKEN_SECRET: process.env.DELIVERY_TOKEN_SECRET ?? devFallback('dev-delivery-secret', 'DELIVERY_TOKEN_SECRET'),
    SESSION_SIGNING_SECRET: process.env.SESSION_SIGNING_SECRET ?? devFallback('dev-session-signing-secret-min-32-chars!!', 'SESSION_SIGNING_SECRET'),
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? '',
    STRIPE_PRICE_QUICK_CLEANUP: process.env.STRIPE_PRICE_QUICK_CLEANUP ?? '',
    STRIPE_PRICE_MARKETPLACE_LISTING: process.env.STRIPE_PRICE_MARKETPLACE_LISTING ?? '',
    STRIPE_PRICE_PRODUCT_LAUNCH: process.env.STRIPE_PRICE_PRODUCT_LAUNCH ?? '',
    STRIPE_PRICE_MONTHLY_RETAINER: process.env.STRIPE_PRICE_MONTHLY_RETAINER ?? '',
    STRIPE_PRICE_AGENCY_WHITE_LABEL: process.env.STRIPE_PRICE_AGENCY_WHITE_LABEL ?? '',
    GUMROAD_WEBHOOK_SECRET: process.env.GUMROAD_WEBHOOK_SECRET ?? '',
    APP_URL: process.env.APP_URL ?? 'http://localhost:3000',
    REAL_INTEGRATIONS_ENABLED: process.env.REAL_INTEGRATIONS_ENABLED === 'true',
  };
}

const REQUIRED_SECRETS = [
  'CSRF_SECRET',
  'SESSION_SECRET',
  'ENCRYPTION_KEY',
  'UPLOAD_TOKEN_SECRET',
  'DELIVERY_TOKEN_SECRET',
  'DATABASE_URL',
] as const;

export function validateSecrets(): void {
  const missing: string[] = [];
  for (const secret of REQUIRED_SECRETS) {
    const value = process.env[secret];
    if (!value || value.length === 0) {
      missing.push(secret);
    }
  }
  if (missing.length > 0) {
    const prefix = isProduction()
      ? `[CRITICAL] Required secrets missing in production`
      : `[env] WARNING: Required secrets missing (app will use dev fallbacks)`;
    console.warn(`${prefix}: ${missing.join(', ')}`);
    if (isProduction()) {
      throw new Error(`Required secrets not set: ${missing.join(', ')}`);
    }
  }
}
