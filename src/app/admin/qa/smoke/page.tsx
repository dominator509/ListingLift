import { QaSmokeTargetPanel } from '@/components/full-testing-qa';
import { PageHeader } from '@/components/ui/page-header';
import { getQaSmokeRouteTargets } from '@/server/services/full-testing-qa-smoke-service';

export default function Page() {
  return (
    <main>
      <PageHeader eyebrow="Phase 38" title="Smoke and browser QA plan" description="Route groups Codex must browser-render with safe demo headers or real authenticated sessions before deployment readiness is claimed." />
      <QaSmokeTargetPanel smokeTargets={getQaSmokeRouteTargets()} />
    </main>
  );
}
