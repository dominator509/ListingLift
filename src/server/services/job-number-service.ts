import { buildJobNumber } from '@/domain/job-queue';

export type JobNumberSequenceInput = {
  organizationSlug?: string | null;
  existingCount: number;
  createdAt?: Date | string;
};

export function getJobNumberPrefix(organizationSlug?: string | null): string {
  if (!organizationSlug) return 'LL';
  const cleaned = organizationSlug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  return cleaned || 'LL';
}

export function buildNextJobNumber(input: JobNumberSequenceInput): string {
  return buildJobNumber({
    prefix: getJobNumberPrefix(input.organizationSlug),
    sequence: input.existingCount + 1,
    createdAt: input.createdAt,
  });
}

export function assertJobNumberFormat(jobNumber: string): void {
  if (!/^[A-Z0-9]{2,4}-\d{6}-\d{5}$/.test(jobNumber)) {
    throw new Error('Invalid ListingLift job number format.');
  }
}
