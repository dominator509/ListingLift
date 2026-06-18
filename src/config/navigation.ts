export type NavItem = { label: string; href: string; description?: string };

export const publicNav: NavItem[] = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Packages', href: '/packages' },
  { label: 'Examples', href: '/examples' },
  { label: 'Sellers', href: '/marketplace-sellers' },
  { label: 'Agencies', href: '/agency-white-label' },
];

export const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Jobs', href: '/admin/jobs' },
  { label: 'Uploads', href: '/admin/uploads' },
  { label: 'Processing', href: '/admin/processing' },
  { label: 'Previews', href: '/admin/previews' },
  { label: 'Quality control', href: '/admin/quality-control' },
  { label: 'Flagged outputs', href: '/admin/flagged-outputs' },
  { label: 'Approvals', href: '/admin/approvals' },
  { label: 'Clients', href: '/admin/clients' },
  { label: 'Packages', href: '/admin/packages' },
  { label: 'Presets', href: '/admin/presets' },
  { label: 'Sales channels', href: '/admin/sales-channels' },
  { label: 'Other sales channels', href: '/admin/other-sales-channels' },
  { label: 'Etsy', href: '/admin/etsy' },
  { label: 'Shopify', href: '/admin/shopify' },
  { label: 'Social commerce', href: '/admin/social-commerce' },
  { label: 'External orders', href: '/admin/external-orders' },
  { label: 'RBAC', href: '/admin/rbac' },
  { label: 'Integrations', href: '/admin/integrations' },
  { label: 'Notifications', href: '/admin/notifications' },
  { label: 'Automation webhooks', href: '/admin/automation-webhooks' },
  { label: 'API access', href: '/admin/api-access' },
  { label: 'Security', href: '/admin/security' },
  { label: 'QA', href: '/admin/qa' },
  { label: 'Billing', href: '/admin/billing' },
  { label: 'Credits', href: '/admin/credits' },
  { label: 'Subscriptions', href: '/admin/subscriptions' },
  { label: 'Manual invoices', href: '/admin/billing/manual-invoices' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Revenue', href: '/admin/revenue' },
  { label: 'Upsells', href: '/admin/upsells' },
];

export const salesChannelNav: NavItem[] = [
  { label: 'Gumroad', href: '/admin/gumroad' },
  { label: 'Fiverr', href: '/admin/fiverr' },
  { label: 'Upwork', href: '/admin/upwork' },
  { label: 'Taskrabbit', href: '/admin/taskrabbit' },
  { label: 'Taskrabbit intake', href: '/admin/taskrabbit/task-intake' },
  { label: 'Taskrabbit delivery', href: '/admin/taskrabbit/delivery' },
  { label: 'Taskrabbit conversions', href: '/admin/taskrabbit/conversions' },
  { label: 'Etsy', href: '/admin/etsy' },
  { label: 'Shopify', href: '/admin/shopify' },
  { label: 'Social commerce', href: '/admin/social-commerce' },
  { label: 'Etsy intake', href: '/admin/etsy/order-intake' },
  { label: 'Etsy listings', href: '/admin/etsy/listings' },
  { label: 'Etsy delivery', href: '/admin/etsy/delivery' },
  { label: 'Etsy reports', href: '/admin/etsy/reports' },
  { label: 'Other channels', href: '/admin/other-sales-channels' },
  { label: 'Other channel intake', href: '/admin/other-sales-channels/manual-order' },
  { label: 'Other channel templates', href: '/admin/other-sales-channels/templates' },
  { label: 'Other channel follow-ups', href: '/admin/other-sales-channels/follow-ups' },
];

export const clientNav: NavItem[] = [
  { label: 'Dashboard', href: '/client' },
  { label: 'Jobs', href: '/client/jobs' },
  { label: 'Downloads', href: '/client/downloads' },
  { label: 'Revisions', href: '/client/revisions' },
  { label: 'Billing', href: '/client/billing' },
  { label: 'Upgrade', href: '/client/upgrade' },
];

export const agencyNav: NavItem[] = [
  { label: 'Dashboard', href: '/agency' },
  { label: 'Workspaces', href: '/agency/workspaces' },
  { label: 'Queue', href: '/agency/queue' },
  { label: 'White-label settings', href: '/agency/white-label-settings' },
  { label: 'Branded delivery', href: '/agency/delivery' },
  { label: 'Branded reports', href: '/agency/reports' },
  { label: 'Billing', href: '/agency/billing' },
  { label: 'Volume pricing', href: '/agency/volume-pricing' },
  { label: 'Team', href: '/agency/team' },
];


export const phase27MarketplaceExportNav = [
  { label: 'Marketplace Exports', href: '/admin/marketplace-exports' },
  { label: 'Marketplace Manual Order', href: '/admin/marketplace-exports/manual-order' },
  { label: 'Marketplace Export Plan', href: '/admin/marketplace-exports/export-plan' },
  { label: 'Marketplace Delivery', href: '/admin/marketplace-exports/delivery' },
  { label: 'Marketplace Safety', href: '/admin/marketplace-exports/safety' },
];


// Phase 28 file storage navigation:
// Codex should add Admin navigation links for /admin/file-storage,
// /admin/file-storage/connections, /admin/file-storage/folder-import,
// and /admin/file-storage/delivery-export if the navigation config is data-driven.


export const phase29AutomationWebhookNav = [
  { label: 'Automation Webhooks', href: '/admin/automation-webhooks' },
  { label: 'Automation Subscriptions', href: '/admin/automation-webhooks/subscriptions' },
  { label: 'Automation Events', href: '/admin/automation-webhooks/events' },
  { label: 'Automation Dead Letter', href: '/admin/automation-webhooks/dead-letter' },
  { label: 'Automation Test', href: '/admin/automation-webhooks/test' },
];

export const phase30TaskNotificationIntegrationNav = [
  { label: 'Task & Notification Integrations', href: '/admin/task-notification-integrations' },
  { label: 'Integration Providers', href: '/admin/task-notification-integrations/providers' },
  { label: 'Data Exports', href: '/admin/task-notification-integrations/exports' },
  { label: 'Task Creation', href: '/admin/task-notification-integrations/tasks' },
  { label: 'Notification Templates', href: '/admin/task-notification-integrations/templates' },
  { label: 'Integration Health', href: '/admin/task-notification-integrations/health' },
];

// Phase 31 advanced processing navigation marker:
// Codex should expose these routes in the admin navigation once runtime wiring is complete:
// - /admin/advanced-processing
// - /admin/advanced-processing/recipes
// - /admin/advanced-processing/reports
// - /admin/jobs/[jobId]/advanced-processing

export const phase32ReportUpsellNav = [
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Report Builder', href: '/admin/reports/builder' },
  { label: 'Upsell Engine', href: '/admin/upsells' },
  { label: 'Upsell Opportunities', href: '/admin/upsells/opportunities' },
  { label: 'Upsell Templates', href: '/admin/upsells/templates' },
  { label: 'Client Reports', href: '/client/reports' },
];


export const phase36ApiAccessAdvancedIntegrationNav = [
  { label: 'API Access', href: '/admin/api-access' },
  { label: 'API Tokens', href: '/admin/api-access/tokens' },
  { label: 'API Scopes', href: '/admin/api-access/scopes' },
  { label: 'API Webhooks', href: '/admin/api-access/webhooks' },
  { label: 'Shared Upload Portal', href: '/admin/api-access/shared-upload-portal' },
  { label: 'Advanced Integrations', href: '/admin/api-access/integrations' },
];


export const phase37SecurityHardeningNav = [
  { label: 'Security Hardening', href: '/admin/security' },
  { label: 'Upload Safety', href: '/admin/security/upload-safety' },
  { label: 'Secrets & Tokens', href: '/admin/security/secrets' },
  { label: 'Rate Limits', href: '/admin/security/rate-limits' },
  { label: 'Webhook Verification', href: '/admin/security/webhooks' },
  { label: 'Audit Map', href: '/admin/security/audit-map' },
];


export const phase38FullTestingQaNav = [
  { label: 'Full Testing & QA', href: '/admin/qa' },
  { label: 'Unit QA', href: '/admin/qa/unit' },
  { label: 'Integration QA', href: '/admin/qa/integration' },
  { label: 'E2E QA', href: '/admin/qa/e2e' },
  { label: 'Security QA', href: '/admin/qa/security' },
  { label: 'Smoke QA', href: '/admin/qa/smoke' },
];
