import clsx from 'clsx';
import type { JobPriority } from '@/domain/job-queue';

const tones: Record<JobPriority, string> = {
  LOW: 'bg-slate-100 text-slate-700',
  NORMAL: 'bg-blue-50 text-blue-700',
  HIGH: 'bg-amber-50 text-amber-700',
  URGENT: 'bg-red-50 text-red-700',
};

export function JobPriorityBadge({ priority }: { priority: JobPriority }) {
  return <span className={clsx('rounded-full px-2.5 py-1 text-xs font-semibold', tones[priority])}>{priority.toLowerCase()}</span>;
}
