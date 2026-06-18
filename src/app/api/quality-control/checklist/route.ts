import { guardedGet } from '@/server/routes/route-helpers';
import { getQualityControlChecklist, groupQualityChecklistByCategory } from '@/server/services/quality-control-checklist-service';

export async function GET(request: Request) {
  return guardedGet(request, 'review:outputs', () => ({ checklist: getQualityControlChecklist(), grouped: groupQualityChecklistByCategory() }));
}
