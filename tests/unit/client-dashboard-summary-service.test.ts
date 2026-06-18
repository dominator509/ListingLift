import { describe, expect, it } from 'vitest';
import { buildClientDashboardSummary } from '@/server/services/client-dashboard-summary-service';

describe('client dashboard summary service', () => {
  it('calculates credit usage and keeps safe notices', () => {
    const summary = buildClientDashboardSummary({ creditsRemaining: 20, creditsTotal: 50, activeJobs: 2, readyDownloads: 1 });
    expect(summary.metrics.activeJobs).toBe(2);
    expect(summary.billing.creditUsagePercent).toBe(60);
    expect(summary.notices.marketplace).toContain('platform-ready drafts');
  });
});
