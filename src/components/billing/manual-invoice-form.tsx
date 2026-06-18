import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ManualInvoiceForm() {
  return (
    <Card title="Create manual invoice" description="Manual invoices are fulfillment-safe only after server-side payment confirmation and audit logging.">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Client ID" placeholder="client_..." />
        <Input label="Invoice number" placeholder="LLINV-CLIENT-0001" />
        <Input label="Amount cents" placeholder="9900" />
        <Input label="Credits included" placeholder="25" />
      </div>
      <Button type="button" className="mt-5">Create invoice draft</Button>
      <p className="mt-3 text-xs text-slate-500">Codex must wire this to /api/manual-invoices with manage:billing permission.</p>
    </Card>
  );
}
