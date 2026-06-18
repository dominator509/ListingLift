import { Card } from '@/components/ui/card';

export function GumroadWebhookHealthPanel() {
  return (
    <Card title="Webhook safety" description="Gumroad intake stays in dry-run/manual-review mode until webhook signature, dedupe, and persistence are verified by Codex.">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="font-semibold text-slate-900">GUMROAD_ENABLED</dt><dd className="text-slate-600">false by default</dd></div>
        <div><dt className="font-semibold text-slate-900">GUMROAD_WEBHOOK_SECRET</dt><dd className="text-slate-600">server-side only</dd></div>
        <div><dt className="font-semibold text-slate-900">Duplicate sale ID</dt><dd className="text-slate-600">must not create another job or credits</dd></div>
        <div><dt className="font-semibold text-slate-900">Refunded sale</dt><dd className="text-slate-600">must not grant fulfillment access</dd></div>
      </dl>
    </Card>
  );
}
