import { describe, expect, it } from 'vitest';
import { adminNav, agencyNav, clientNav, publicNav, salesChannelNav } from '@/config/navigation';
import { formatStatus } from '@/components/workflow/job-status-badge';

describe('phase 1 ui shell contract', () => {
  it('defines all major workspace navigation groups', () => {
    expect(publicNav.map((item) => item.href)).toEqual(expect.arrayContaining(['/pricing', '/packages', '/examples', '/marketplace-sellers', '/agency-white-label']));
    expect(adminNav.map((item) => item.href)).toEqual(expect.arrayContaining(['/admin/jobs', '/admin/clients', '/admin/packages', '/admin/presets', '/admin/sales-channels', '/admin/integrations', '/admin/billing', '/admin/reports', '/admin/revenue']));
    expect(clientNav.map((item) => item.href)).toEqual(expect.arrayContaining(['/client/jobs', '/client/downloads', '/client/revisions', '/client/billing', '/client/upgrade']));
    expect(agencyNav.map((item) => item.href)).toEqual(expect.arrayContaining(['/agency/workspaces', '/agency/queue', '/agency/white-label-settings', '/agency/billing', '/agency/team']));
    expect(salesChannelNav.map((item) => item.href)).toEqual(expect.arrayContaining(['/admin/gumroad', '/admin/fiverr', '/admin/upwork', '/admin/taskrabbit']));
  });

  it('formats job statuses for accessible badges', () => {
    expect(formatStatus('WAITING_FOR_REVIEW')).toBe('Waiting For Review');
    expect(formatStatus('READY_FOR_DELIVERY')).toBe('Ready For Delivery');
  });
});
