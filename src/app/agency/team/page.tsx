import { AgencyGuardrailPanel, AgencyTeamTable } from '@/components/agency-white-label';
import { PageHeader } from '@/components/ui/page-header';
import { buildAgencyTeamRows } from '@/server/services/agency-team-service';

export default function AgencyTeamPage() {
  const members = buildAgencyTeamRows();
  return (
    <main>
      <PageHeader
        eyebrow="Agency team"
        title="Team members and workspace access"
        description="Agency-scoped membership roles for admins, billing managers, fulfillment reviewers, designers, and client viewers. Invites must use expiring hashed tokens and audit trails."
      />
      <div className="space-y-6">
        <AgencyTeamTable members={members} />
        <AgencyGuardrailPanel />
      </div>
    </main>
  );
}
