import clsx from 'clsx';
import type { DeadlineWarningLevel } from '@/domain/job-queue';

const labels: Record<DeadlineWarningLevel, string> = {
  NONE: 'No warning',
  UPCOMING: 'Upcoming',
  DUE_SOON: 'Due soon',
  OVERDUE: 'Overdue',
  BLOCKED: 'Blocked',
};

const tones: Record<DeadlineWarningLevel, string> = {
  NONE: 'bg-slate-100 text-slate-700',
  UPCOMING: 'bg-blue-50 text-blue-700',
  DUE_SOON: 'bg-amber-50 text-amber-700',
  OVERDUE: 'bg-red-50 text-red-700',
  BLOCKED: 'bg-purple-50 text-purple-700',
};

export function DeadlineWarningBadge({ level }: { level: DeadlineWarningLevel }) {
  return <span className={clsx('rounded-full px-2.5 py-1 text-xs font-semibold', tones[level])}>{labels[level]}</span>;
}
