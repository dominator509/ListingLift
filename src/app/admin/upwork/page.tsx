import { UpworkOfferMappingTable, UpworkRevenueSummaryCard, UpworkSafetyPanel, UpworkWorkflowBoard } from '@/components/upwork';

export default function AdminUpworkPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Upwork workflow</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Manual-first contract intake, package mapping, proposal/delivery templates, retainer reminders, and revenue attribution for high-value Upwork projects.</p>
      </div>
      <UpworkWorkflowBoard />
      <UpworkRevenueSummaryCard />
      <UpworkOfferMappingTable />
      <UpworkSafetyPanel />
    </main>
  );
}
