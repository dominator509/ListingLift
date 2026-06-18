import { describe, expect, it } from 'vitest';
import { createFiverrManualOrderPlan } from '@/server/services/fiverr-order-intake-service';
import { buildFiverrRevisionStatusDraft } from '@/server/services/fiverr-revision-workflow-service';

describe('Phase 20 Fiverr route contract', () => {
  it('manual-order contract contains external order, client, job, upload, and safety sections', () => {
    const plan = createFiverrManualOrderPlan({ orderId: 'FO-999', buyerUsername: 'buyer', gigTitle: 'basic 10 images', dryRun: true, orderAmount: 50, currency: 'USD', uploadStatus: 'WAITING_FOR_UPLOAD' });
    expect(plan).toHaveProperty('externalOrderDraft');
    expect(plan).toHaveProperty('clientDraft');
    expect(plan).toHaveProperty('jobDraft');
    expect(plan).toHaveProperty('uploadLinkPlan');
    expect(plan).toHaveProperty('safety');
  });

  it('revision status contract blocks completion for open revisions', () => {
    const draft = buildFiverrRevisionStatusDraft({ orderId: 'FO-999', revisionStatus: 'IN_PROGRESS', dryRun: true });
    expect(draft.blocksCompletion).toBe(true);
  });
});
