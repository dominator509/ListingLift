import { TaskrabbitDeliveryMessagePanel, TaskrabbitSafetyPanel } from '@/components/taskrabbit';

export default function TaskrabbitDeliveryPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Taskrabbit delivery</h1>
        <p className="mt-3 text-slate-600">Prepare manual delivery copy and record delivery completion without unauthorized platform messaging automation.</p>
      </div>
      <TaskrabbitDeliveryMessagePanel />
      <TaskrabbitSafetyPanel />
    </main>
  );
}
