import { TaskrabbitConversionPanel, TaskrabbitRevenueSummaryCard } from '@/components/taskrabbit';

export default function TaskrabbitConversionsPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Taskrabbit conversions</h1>
        <p className="mt-3 text-slate-600">Track follow-up opportunities from local tasks to direct ListingLift retainers where allowed.</p>
      </div>
      <TaskrabbitRevenueSummaryCard />
      <TaskrabbitConversionPanel />
    </main>
  );
}
