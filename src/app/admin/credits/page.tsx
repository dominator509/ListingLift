import { CreditBalancePanel, CreditLedgerTable } from '@/components/billing';

export default function AdminCreditsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Phase 19</p>
        <h1 className="text-3xl font-bold text-slate-950">Credits</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Review image cleanup credits, manual adjustments, credit usage, and audit requirements. No credit mutation is trusted from the client.</p>
      </div>
      <CreditBalancePanel />
      <CreditLedgerTable />
    </main>
  );
}
