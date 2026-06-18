import { z } from 'zod';

const booleanString = z
  .union([z.literal('true'), z.literal('false'), z.boolean()])
  .transform((v) => v === true || v === 'true');

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(16),
  UPLOAD_TOKEN_SECRET: z.string().min(16),
  DELIVERY_TOKEN_SECRET: z.string().min(16),
  MOCK_IMAGE_PROVIDER_ENABLED: booleanString.default(true),
  REAL_IMAGE_PROVIDER_CALLS_ENABLED: booleanString.default(false),
  MOCK_INTEGRATIONS_ENABLED: booleanString.default(true),
  REAL_INTEGRATIONS_ENABLED: booleanString.default(false),
  RATE_LIMIT_ENABLED: booleanString.default(true),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  STRIPE_ENABLED: booleanString.default(false),
  STRIPE_SECRET_KEY: z.string().optional().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
  STRIPE_TEST_MODE: booleanString.default(true),
  STRIPE_PRICE_QUICK_CLEANUP: z.string().optional().default(''),
  STRIPE_PRICE_MARKETPLACE_LISTING: z.string().optional().default(''),
  STRIPE_PRICE_PRODUCT_LAUNCH: z.string().optional().default(''),
  STRIPE_PRICE_MONTHLY_RETAINER: z.string().optional().default(''),
  STRIPE_PRICE_AGENCY_WHITE_LABEL: z.string().optional().default(''),
  GUMROAD_ENABLED: booleanString.default(false),
  GUMROAD_WEBHOOK_SECRET: z.string().optional().default(''),
  GUMROAD_PRODUCT_QUICK_CLEANUP_10: z.string().optional().default(''),
  GUMROAD_PRODUCT_MARKETPLACE_LISTING_25: z.string().optional().default(''),
  GUMROAD_PRODUCT_MARKETPLACE_LISTING_50: z.string().optional().default(''),
  GUMROAD_PRODUCT_MONTHLY_CREDIT_PACK: z.string().optional().default(''),
  GUMROAD_PRODUCT_PRODUCT_LAUNCH_KIT: z.string().optional().default(''),
  GUMROAD_PRODUCT_AGENCY_STARTER: z.string().optional().default(''),
  EMAIL_ENABLED: booleanString.default(false),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.string().optional().default('587'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
  EMAIL_FROM: z.string().optional().default(''),
  REMOVE_BG_ENABLED: booleanString.default(false),
  REMOVE_BG_API_KEY: z.string().optional().default(''),
  CLOUDINARY_ENABLED: booleanString.default(false),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  REPLICATE_ENABLED: booleanString.default(false),
  REPLICATE_API_TOKEN: z.string().optional().default(''),
  CLIPDROP_STYLE_ENABLED: booleanString.default(false),
  CLIPDROP_STYLE_API_KEY: z.string().optional().default(''),
  GOOGLE_DRIVE_ENABLED: booleanString.default(false),
  DROPBOX_ENABLED: booleanString.default(false),
  ONEDRIVE_ENABLED: booleanString.default(false),
  BOX_ENABLED: booleanString.default(false),
  FIVERR_ENABLED: booleanString.default(false),
  FIVERR_MANUAL_WORKFLOW_ENABLED: booleanString.default(true),
  FIVERR_ORDER_IMPORT_ENABLED: booleanString.default(false),
  FIVERR_DELIVERY_LINKS_REQUIRE_OPERATOR_CONFIRMATION: booleanString.default(true),
  UPWORK_ENABLED: booleanString.default(false),
  TASKRABBIT_ENABLED: booleanString.default(false),
  FREELANCER_ENABLED: booleanString.default(false),
  PEOPLEPERHOUR_ENABLED: booleanString.default(false),
  GURU_ENABLED: booleanString.default(false),
  CONTRA_ENABLED: booleanString.default(false),
  THUMBTACK_ENABLED: booleanString.default(false),
  BARK_ENABLED: booleanString.default(false),
  HOUZZ_ENABLED: booleanString.default(false),
  ETSY_ENABLED: booleanString.default(false),
  SHOPIFY_ENABLED: booleanString.default(false),
  SHOPIFY_OAUTH_ENABLED: booleanString.default(false),
  SHOPIFY_API_KEY: z.string().optional(),
  SHOPIFY_API_SECRET: z.string().optional(),
  SHOPIFY_WEBHOOK_SECRET: z.string().optional(),
  TIKTOK_SHOP_ENABLED: booleanString.default(false),
  FACEBOOK_BUSINESS_PAGE_ENABLED: booleanString.default(false),
  TIKTOK_PROFILE_ENABLED: booleanString.default(false),
  SOCIAL_COMMERCE_WORKFLOWS_ENABLED: booleanString.default(true),
  SOCIAL_COMMERCE_AUTOMATION_ENABLED: booleanString.default(false),
  INSTAGRAM_SHOP_ENABLED: booleanString.default(false),
  INSTAGRAM_PROFILE_ENABLED: booleanString.default(false),
  FACEBOOK_MARKETPLACE_ENABLED: booleanString.default(false),
  PINTEREST_ENABLED: booleanString.default(false),
  YOUTUBE_SHORTS_ENABLED: booleanString.default(false),
  GOOGLE_BUSINESS_PROFILE_SOCIAL_ENABLED: booleanString.default(false),
  ZAPIER_WEBHOOKS_ENABLED: booleanString.default(false),
  MAKE_WEBHOOKS_ENABLED: booleanString.default(false),
  N8N_WEBHOOKS_ENABLED: booleanString.default(false),
  SLACK_ENABLED: booleanString.default(false),
  GOOGLE_SHEETS_ENABLED: booleanString.default(false),
  AIRTABLE_ENABLED: booleanString.default(false),
  TRELLO_ENABLED: booleanString.default(false),
  CLICKUP_ENABLED: booleanString.default(false),
  ASANA_ENABLED: booleanString.default(false),
  NOTION_ENABLED: booleanString.default(false),
  AUTOMATION_WEBHOOKS_ENABLED: booleanString.default(false),
  GENERIC_AUTOMATION_WEBHOOKS_ENABLED: booleanString.default(false),
  AUTOMATION_WEBHOOK_SIGNING_SECRET: z.string().optional().default(''),
  AUTOMATION_WEBHOOK_MAX_RETRIES: z.string().optional().default('3'),
  AUTOMATION_WEBHOOK_RATE_LIMIT_PER_MINUTE: z.string().optional().default('30'),
  AUTOMATION_WEBHOOK_DISPATCH_ENABLED: booleanString.default(false),
  MANUAL_INVOICES_ENABLED: booleanString.default(true),
  CREDIT_LEDGER_ENABLED: booleanString.default(true),
  SUBSCRIPTION_ENTITLEMENTS_ENABLED: booleanString.default(true),
});

export type AppEnv = z.infer<typeof envSchema>;

// Phase 23 other sales channel env note: Codex should keep all generic/manual channel flags disabled by default unless explicitly configured.
// Phase 22 Taskrabbit env note: Codex should add TASKRABBIT_* variables to the validated env schema after reconciling existing env parsing style.

// Phase 26 social-commerce workflow env note: keep automation disabled unless a platform-approved integration is explicitly configured and tested.


// Phase 28 file storage environment notes:
// Codex must add typed env validation for LOCAL_FILE_STORAGE_ENABLED,
// FILE_STORAGE_DEFAULT_PROVIDER, FILE_STORAGE_SIGNED_URL_TTL_SECONDS,
// Google Drive OAuth vars, Dropbox OAuth vars, and destructive-operation flags.

// Phase 29 automation webhook env note: keep real dispatch disabled unless AUTOMATION_WEBHOOKS_ENABLED, provider-specific flags, REAL_INTEGRATIONS_ENABLED, and encrypted secret references are configured and tested.

// Phase 30 optional task/notification integration environment variables.
// Codex must merge these into the canonical env validation object if this file exports a single Zod schema.
export const phase30TaskNotificationEnvKeys = [
  'TASK_NOTIFICATION_INTEGRATIONS_ENABLED',
  'TASK_NOTIFICATION_REAL_CALLS_ENABLED',
  'SLACK_BOT_TOKEN',
  'SLACK_SIGNING_SECRET',
  'SLACK_WEBHOOK_URL',
  'GOOGLE_SHEETS_CLIENT_EMAIL',
  'GOOGLE_SHEETS_PRIVATE_KEY',
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'AIRTABLE_API_TOKEN',
  'AIRTABLE_BASE_ID',
  'AIRTABLE_TABLE_ID',
  'TRELLO_API_KEY',
  'TRELLO_TOKEN',
  'TRELLO_BOARD_ID',
  'TRELLO_LIST_ID',
  'CLICKUP_API_TOKEN',
  'CLICKUP_LIST_ID',
  'ASANA_ACCESS_TOKEN',
  'ASANA_PROJECT_ID',
  'NOTION_API_TOKEN',
  'NOTION_DATABASE_ID',
] as const;

// Phase 31 advanced image processing env additions for Codex validation:
// ADVANCED_IMAGE_PROCESSING_ENABLED=false
// REAL_ADVANCED_IMAGE_PROCESSING_ENABLED=false
// ADVANCED_IMAGE_WORKER_ENABLED=false
// LOCAL_IMAGE_WORKER_ENABLED=false
// ADVANCED_IMAGE_MAX_BATCH_SIZE=100
