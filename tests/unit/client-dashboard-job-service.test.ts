import { describe, expect, it } from 'vitest';
import { filterClientDashboardJobs, buildClientDashboardJobSummary } from '@/server/services/client-dashboard-job-service';

describe('client dashboard job service', () => {
  const jobs = [
    { id: '1', title: 'Active', status: 'WAITING_FOR_REVIEW' },
    { id: '2', title: 'Done', status: 'DELIVERED', readyDownloads: 1 },
    { id: '3', title: 'Blocked', status: 'FLAGGED_OUTPUTS' },
  ];

  it('filters by dashboard group', () => {
    expect(filterClientDashboardJobs(jobs, { group: 'active' })).toHaveLength(1);
    expect(filterClientDashboardJobs(jobs, { group: 'completed' })).toHaveLength(1);
    expect(filterClientDashboardJobs(jobs, { group: 'blocked' })).toHaveLength(1);
  });

  it('summarizes visible work', () => {
    const summary = buildClientDashboardJobSummary(jobs);
    expect(summary.readyDownloads).toBe(1);
    expect(summary.active).toBe(1);
  });
});
