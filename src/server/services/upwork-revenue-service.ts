import { type UpworkContractType } from '@/domain/upwork';

export function buildUpworkRevenueAttribution(input: {
  contractId: string;
  contractTitle?: string;
  contractType: UpworkContractType;
  billedAmountCents?: number;
  hourlyRateCents?: number;
  estimatedHours?: number;
  currency?: string;
}) {
  const estimatedHourlyTotal = input.hourlyRateCents && input.estimatedHours
    ? Math.round(input.hourlyRateCents * input.estimatedHours)
    : undefined;
  const amountCents = input.billedAmountCents ?? estimatedHourlyTotal ?? 0;
  return {
    channel: 'Upwork',
    externalOrderId: input.contractId,
    contractTitle: input.contractTitle,
    contractType: input.contractType,
    amountCents,
    currency: input.currency ?? 'USD',
    recognizedWhen: input.contractType === 'HOURLY' ? 'manual_weekly_review' : 'manual_milestone_confirmation',
    requiresManualConfirmation: true,
  };
}
