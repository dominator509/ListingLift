import { buildTaskrabbitDirectFollowUpPrompt } from '@/domain/taskrabbit';

export function TaskrabbitConversionPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Direct-retainer conversion tracking</h2>
      <p className="mt-2 text-sm text-slate-600">Track follow-up opportunities from local service tasks to direct ListingLift retainers, only where platform rules and customer consent allow.</p>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        {buildTaskrabbitDirectFollowUpPrompt({ customerName: 'Customer', businessName: 'Local shop', monthlyImageEstimate: 40, serviceAngle: 'marketplace listing photo prep' })}
      </div>
    </section>
  );
}
