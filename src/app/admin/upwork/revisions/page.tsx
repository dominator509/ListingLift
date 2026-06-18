import { UpworkRevisionStatusPanel, UpworkWorkflowBoard } from '@/components/upwork';

export default function UpworkRevisionsPage() {
  return <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10"><h1 className="text-3xl font-bold text-slate-950">Upwork revisions</h1><UpworkRevisionStatusPanel /><UpworkWorkflowBoard /></main>;
}
