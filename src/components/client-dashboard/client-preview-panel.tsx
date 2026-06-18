import { Card } from '@/components/ui/card';

export function ClientPreviewPanel() {
  return (
    <Card title="Approved previews" description="Only admin-approved previews should be visible here.">
      <p className="text-sm text-slate-600">Pending, failed, flagged, rejected, and admin-only outputs must never appear in client preview responses.</p>
    </Card>
  );
}
