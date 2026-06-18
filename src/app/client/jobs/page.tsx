import { ClientJobList } from '@/components/client-dashboard';
import { PageHeader } from '@/components/ui/page-header';

export default function ClientJobsPage() {
  return (
    <main>
      <PageHeader title="Your jobs" description="Client-scoped active and completed jobs. Codex must replace demo rows with Prisma queries scoped to the active client membership." />
      <ClientJobList jobs={[]} />
    </main>
  );
}
