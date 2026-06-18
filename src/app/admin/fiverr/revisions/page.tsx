import { FiverrRevisionStatusPanel, FiverrSafetyPanel } from '@/components/fiverr';
import { PageHeader } from '@/components/ui/page-header';

export default function FiverrRevisionsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <PageHeader title="Fiverr revisions" description="Track revision status manually and block completion until requested revisions are resolved and delivered through Fiverr." />
      <FiverrRevisionStatusPanel />
      <FiverrSafetyPanel />
    </main>
  );
}
