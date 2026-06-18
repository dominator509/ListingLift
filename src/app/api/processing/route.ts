import { listImageProviderHealth } from '@/server/adapters/image/registry';
import { guardedGet } from '@/server/routes/route-helpers';
import { CORE_PROCESSING_OPERATIONS, PROCESSING_RUN_STATUSES, PROCESSING_STEP_STATUSES } from '@/domain/image-processing';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:jobs', async () => ({
    phase: 'Phase 11 — Core Image Processing Pipeline',
    operations: CORE_PROCESSING_OPERATIONS,
    runStatuses: PROCESSING_RUN_STATUSES,
    stepStatuses: PROCESSING_STEP_STATUSES,
    providers: await listImageProviderHealth(),
    note: 'Processing records are contract/dry-run until Codex wires storage, Sharp, Prisma transactions, and provider runtime.',
  }));
}
