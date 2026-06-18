import { ProviderStatusGrid, NotificationTemplatePanel, DataExportPlanPanel, TaskCreationPlanPanel, TaskNotificationHealthPanel, TaskIntegrationSafetyPanel } from '@/components/task-notification-integrations';

export default function TaskNotificationIntegrationsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Phase 30</p>
        <h1 className="text-3xl font-bold text-slate-950">Task & notification integrations</h1>
        <p className="mt-2 max-w-3xl text-slate-600">Notifications and task/data exports for Slack, email, Google Sheets, Airtable, Trello, ClickUp, Asana, and Notion. All real integrations must remain feature-flagged and manually recoverable.</p>
      </div>
      <ProviderStatusGrid /><TaskIntegrationSafetyPanel />
    </main>
  );
}
