import { describe, expect, it } from 'vitest';
import { buildAgencyDashboardSummary } from '@/server/services/agency-dashboard-summary-service';


describe('agency dashboard summary service', () => {
  it('builds dry-run workspace, queue, brand, and billing summary', () => {
    const summary = buildAgencyDashboardSummary();
    expect(summary.dryRun).toBe(true);
    expect(summary.workspaces.totalWorkspaces).toBeGreaterThan(0);
    expect(summary.queue.totalItems).toBeGreaterThan(0);
    expect(summary.billing.manualReviewRequired).toBe(true);
    expect(summary.notices.guaranteeNotice).toContain('Do not guarantee');
  });
});
