import { Card } from '@/components/ui/card';

export function GumroadAdminNotificationPanel() {
  return (
    <Card title="Admin notification" description="Operators should see every Gumroad sale that creates a job, grants credits, or requires manual review.">
      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Sample subject</p>
        <p>Gumroad intake: Marketplace listing pack — seller-review recommended</p>
        <p className="mt-3 text-slate-600">Never include webhook secrets, raw tokens, or full payment payloads in outbound admin notifications.</p>
      </div>
    </Card>
  );
}
