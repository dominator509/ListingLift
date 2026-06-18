import { getClientDashboardJobGroup } from '@/domain/client-dashboard';

export type ClientDashboardJobRow = {
  id: string;
  jobNumber?: string | null;
  title: string;
  status: string;
  packageName?: string | null;
  targetPlatform?: string | null;
  deadline?: string | null;
  readyDownloads?: number;
  approvedPreviewCount?: number;
  openRevisionCount?: number;
};

export function filterClientDashboardJobs(jobs: ClientDashboardJobRow[], options: { group?: 'active' | 'completed' | 'blocked' | 'all'; search?: string | null; status?: string | null } = {}) {
  const group = options.group ?? 'active';
  const search = options.search?.trim().toLowerCase();
  const status = options.status?.trim().toUpperCase();
  return jobs.filter((job) => {
    const jobGroup = getClientDashboardJobGroup(job.status);
    if (group !== 'all' && jobGroup !== group) return false;
    if (status && job.status.toUpperCase() !== status) return false;
    if (search) {
      const haystack = [job.title, job.jobNumber, job.packageName, job.targetPlatform].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export function buildClientDashboardJobSummary(jobs: ClientDashboardJobRow[]) {
  return jobs.reduce(
    (summary, job) => {
      const group = getClientDashboardJobGroup(job.status);
      if (group === 'active') summary.active += 1;
      if (group === 'completed') summary.completed += 1;
      if (group === 'blocked') summary.blocked += 1;
      summary.readyDownloads += job.readyDownloads ?? 0;
      summary.approvedPreviews += job.approvedPreviewCount ?? 0;
      summary.openRevisions += job.openRevisionCount ?? 0;
      return summary;
    },
    { active: 0, completed: 0, blocked: 0, readyDownloads: 0, approvedPreviews: 0, openRevisions: 0 },
  );
}
