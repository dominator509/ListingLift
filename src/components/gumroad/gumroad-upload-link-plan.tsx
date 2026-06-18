import { Card } from '@/components/ui/card';

export function GumroadUploadLinkPlan() {
  return (
    <Card title="Upload-link plan" description="Upload links are generated only after verified payment and package mapping. Links must be hashed, expiring, and scoped server-side.">
      <ul className="space-y-2 text-sm text-slate-700">
        <li>Image-pack purchases create a job in Waiting for Upload.</li>
        <li>Digital-only purchases do not create an upload link.</li>
        <li>Credit packs update the credit ledger without opening fulfillment access automatically.</li>
        <li>Every generated link must be audit-logged and emailed with redacted log entries.</li>
      </ul>
    </Card>
  );
}
