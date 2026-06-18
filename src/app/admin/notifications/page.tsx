import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/ui/page-header';
import { NotificationHealthPanel } from '@/components/notifications/notification-health-panel';
import { NotificationLogTable } from '@/components/notifications/notification-log-table';

export default function AdminNotificationsPage() {
  return (
    <AppShell variant="admin" navItems={[]}>
      <PageHeader title="Notifications" description="Mock-first email notifications, delivery messages, and alert logs." />
      <div className="grid gap-6">
        <NotificationHealthPanel />
        <NotificationLogTable />
      </div>
    </AppShell>
  );
}
