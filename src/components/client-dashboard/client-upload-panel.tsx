import { Card } from '@/components/ui/card';

export function ClientUploadPanel() {
  return (
    <Card title="Upload product photos" description="Upload links are tokenized, expiring, scoped to a job, and validated server-side.">
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        Client upload UI scaffold. Codex must wire this to upload-token resolution, file validation, ZIP-safety checks, immutable original storage, and audited upload events.
      </div>
    </Card>
  );
}
