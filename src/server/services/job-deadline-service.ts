import { getDeadlineWarningLevel, type DeadlineWarningLevel, type JobPriority } from '@/domain/job-queue';
import type { JobStatus } from '@/domain/job-status';

export type JobDeadlineSummary = {
  deadline: string | null;
  warningLevel: DeadlineWarningLevel;
  label: string;
  isOverdue: boolean;
  priority: JobPriority;
};

export function summarizeJobDeadline(input: {
  deadline?: Date | string | null;
  now?: Date | string;
  status?: JobStatus;
  priority?: JobPriority | null;
}): JobDeadlineSummary {
  const warningLevel = getDeadlineWarningLevel(input);
  return {
    deadline: input.deadline ? new Date(input.deadline).toISOString() : null,
    warningLevel,
    label: deadlineWarningLabel(warningLevel),
    isOverdue: warningLevel === 'OVERDUE',
    priority: input.priority ?? 'NORMAL',
  };
}

export function deadlineWarningLabel(level: DeadlineWarningLevel): string {
  switch (level) {
    case 'OVERDUE': return 'Overdue';
    case 'DUE_SOON': return 'Due within 24 hours';
    case 'UPCOMING': return 'Due within 72 hours';
    case 'BLOCKED': return 'Blocked';
    case 'NONE':
    default: return 'No deadline warning';
  }
}

export function shouldEscalateDeadline(input: { warningLevel: DeadlineWarningLevel; priority?: JobPriority | null }) {
  return input.warningLevel === 'OVERDUE' || (input.warningLevel === 'DUE_SOON' && input.priority !== 'LOW');
}
