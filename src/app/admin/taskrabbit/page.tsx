import { TaskrabbitConversionPanel, TaskrabbitRevenueSummaryCard, TaskrabbitSafetyPanel, TaskrabbitServiceMappingTable, TaskrabbitWorkflowBoard } from '@/components/taskrabbit';

export default function AdminTaskrabbitPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Taskrabbit workflow</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Manual-first local-service intake for product photo cleanup, marketplace listing help, restaurant menu cleanup, real-estate visuals, and small-business ecommerce setup support.</p>
      </div>
      <TaskrabbitWorkflowBoard />
      <TaskrabbitRevenueSummaryCard />
      <TaskrabbitServiceMappingTable />
      <TaskrabbitConversionPanel />
      <TaskrabbitSafetyPanel />
    </main>
  );
}
