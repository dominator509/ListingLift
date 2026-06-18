import { Badge } from '@/components/ui/badge';
import type { QualityFlagSeverity } from '@/domain/quality-control';

const toneBySeverity: Record<QualityFlagSeverity, 'slate' | 'amber' | 'red'> = {
  INFO: 'slate',
  WARNING: 'amber',
  BLOCKER: 'red',
};

export function QualityFlagBadge({ label, severity }: { label: string; severity: QualityFlagSeverity }) {
  return <Badge tone={toneBySeverity[severity]}>{label}</Badge>;
}
