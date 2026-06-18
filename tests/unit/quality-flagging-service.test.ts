import { describe, expect, it } from 'vitest';
import { buildQualityFlagDraft, buildQualityFlagResolutionDraft } from '@/server/services/quality-flagging-service';

describe('quality flagging service', () => {
  it('builds delivery-blocking flag drafts from known flag keys', () => {
    const flag = buildQualityFlagDraft(
      { processedFileId: 'pf', flagKey: 'wrong_crop', message: 'Crop is too tight.', clientVisible: false },
      { organizationId: 'org', jobId: 'job', actorUserId: 'user' },
    );
    expect(flag.blocksDelivery).toBe(true);
    expect(flag.auditEvent).toBe('quality.flag.created');
  });

  it('builds audited flag resolution drafts', () => {
    const resolution = buildQualityFlagResolutionDraft(
      { flagId: 'flag', status: 'RESOLVED', resolution: 'Uploaded replacement.', manualReplacementUploaded: true },
      { organizationId: 'org', jobId: 'job', actorUserId: 'user' },
    );
    expect(resolution.auditEvent).toBe('quality.flag.resolved');
  });
});
