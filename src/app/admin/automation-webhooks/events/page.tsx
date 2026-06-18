import { AutomationEventLogTable } from '@/components/automation-webhooks';

export default function AutomationEventsPage() {
  return <main className="space-y-6 p-6"><div><p className="text-sm font-medium uppercase tracking-wide text-blue-700">Phase 29</p><h1 className="text-3xl font-bold text-slate-950">Automation events</h1><p className="mt-2 max-w-3xl text-slate-600">Review planned, queued, sent, skipped, failed, and dead-lettered automation events.</p></div><AutomationEventLogTable /></main>;
}
