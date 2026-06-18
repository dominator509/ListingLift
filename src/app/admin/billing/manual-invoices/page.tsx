import { ManualInvoiceForm, ManualInvoiceTable, ManualPaymentConfirmationPanel, BillingLicenseGatePanel } from '@/components/billing';

export default function ManualInvoicesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Phase 19</p>
        <h1 className="text-3xl font-bold text-slate-950">Manual invoices</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Create invoices, confirm external payments, apply credits, and preserve manual fallback without bypassing billing audit controls.</p>
      </div>
      <ManualInvoiceForm />
      <ManualInvoiceTable />
      <ManualPaymentConfirmationPanel />
      <BillingLicenseGatePanel />
    </main>
  );
}
