import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ManualPaymentConfirmationPanel() {
  return (
    <Card title="Manual payment confirmation" description="Confirm external/manual payments only after evidence review. References are redacted in logs and UI.">
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="Invoice ID" placeholder="manual_invoice_..." />
        <Input label="Amount cents" placeholder="9900" />
        <Input label="Payment reference" placeholder="redacted after save" />
      </div>
      <Button type="button" className="mt-5">Confirm payment draft</Button>
      <p className="mt-3 text-xs text-slate-500">Codex must require manage:billing and write ManualInvoicePayment, InvoicePayment, CreditLedger, and AuditLog transactionally.</p>
    </Card>
  );
}
