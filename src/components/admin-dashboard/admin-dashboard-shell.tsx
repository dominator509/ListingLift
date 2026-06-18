import { PageHeader } from '@/components/ui/page-header';
import type { AdminJobQueueItem } from '@/domain/admin-dashboard-analytics';
import { AdminDashboardMetricCard } from './admin-dashboard-metric-card';
import { AdminJobQueuePanel } from './admin-job-queue-panel';
import { AdminRevenueChannelTable } from './admin-revenue-channel-table';
import { AdminConversionRetainerPanel } from './admin-conversion-retainer-panel';
import { AdminAnalyticsGuardrailPanel } from './admin-analytics-guardrail-panel';

type RevenueChannelRow = {
  channelKey: string;
  channelName: string;
  channelType: string;
  orderCount: number;
  jobCount: number;
  completedJobCount: number;
  formattedNetRevenue: string;
  directConversionCount: number;
  retainerCandidateCount: number;
};

type ConversionRow = {
  clientId?: string;
  clientName: string;
  marketplaceSource: string;
  directSource?: string;
  marketplaceOrderCount: number;
  directOrderCount: number;
  grossRevenueCents: number;
  conversionRatioPercent: number;
  safetyNote: string;
};

type RetainerAlertRow = {
  clientId?: string;
  clientName: string;
  sourceChannel?: string;
  completedJobs: number;
  deliveredImages: number;
  score: number;
  priority: string;
  suggestedAction: string;
  safetyNote: string;
};

type AdminDashboardShellProps = {
  summary: {
    metrics: {
      activeJobs: number;
      completedJobs: number;
      newJobsBySource: number;
      flaggedOutputs: number;
      jobsDueSoon: number;
      marketplaceToDirectConversions: number;
      retainerOpportunityAlerts: number;
      upsellOpportunities: number;
    };
    revenue: { formattedNetRevenue: string; orderCount: number; channelCount: number };
  };
  jobBuckets: {
    active: AdminJobQueueItem[];
    completed: AdminJobQueueItem[];
    flagged: AdminJobQueueItem[];
    dueSoon: AdminJobQueueItem[];
  };
  revenueSnapshot: { channels: RevenueChannelRow[] };
  conversions: ConversionRow[];
  retainerAlerts: RetainerAlertRow[];
};

export function AdminDashboardShell({ summary, jobBuckets, revenueSnapshot, conversions, retainerAlerts }: AdminDashboardShellProps) {
  return (
    <main className="space-y-8 p-6">
      <PageHeader
        eyebrow="Phase 34 admin analytics scaffold"
        title="Admin dashboard and revenue analytics"
        description="A fulfillment command center for active jobs, completed jobs, source attribution, revenue, marketplace-to-direct conversion signals, retainer alerts, and upsell operations."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <AdminDashboardMetricCard label="Active jobs" value={summary.metrics.activeJobs} helper="Open fulfillment workload." />
        <AdminDashboardMetricCard label="Due soon" value={summary.metrics.jobsDueSoon} helper="Deadline-window jobs." />
        <AdminDashboardMetricCard label="Flagged outputs" value={summary.metrics.flaggedOutputs} helper="QC blockers requiring review." />
        <AdminDashboardMetricCard label="Net revenue" value={summary.revenue.formattedNetRevenue} helper={`${summary.revenue.orderCount} orders across ${summary.revenue.channelCount} sources.`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminJobQueuePanel title="Active jobs" jobs={jobBuckets.active} />
        <AdminJobQueuePanel title="Jobs due soon" jobs={jobBuckets.dueSoon} />
        <AdminJobQueuePanel title="Flagged outputs" jobs={jobBuckets.flagged} />
        <AdminJobQueuePanel title="Completed jobs" jobs={jobBuckets.completed} />
      </div>
      <AdminRevenueChannelTable channels={revenueSnapshot.channels} />
      <AdminConversionRetainerPanel conversions={conversions} retainerAlerts={retainerAlerts} />
      <AdminAnalyticsGuardrailPanel />
    </main>
  );
}
