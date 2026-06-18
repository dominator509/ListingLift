import { FullTestingQaShell } from '@/components/full-testing-qa';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 38"
        title="Full testing and QA"
        description="Codex handoff command center for unit, integration, security, adapter-contract, E2E, build, smoke, browser-rendering, Prisma, seed, and no-fake-results verification across the ListingLift fulfillment engine."
      />
      <FullTestingQaShell />
    </main>
  );
}
