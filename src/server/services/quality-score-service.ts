import { calculateQualityScore, evaluateOutputQuality, type QualityOutputInput } from '@/domain/quality-control';

export function calculateOutputQualityScore(input: Pick<QualityOutputInput, 'qualityScore' | 'flags'>) {
  return calculateQualityScore(input);
}

export function assignQualityBand(score: number) {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 75) return 'GOOD';
  if (score >= 65) return 'REVIEW';
  return 'BLOCKED';
}

export function scoreQualityOutput(output: QualityOutputInput) {
  const decision = evaluateOutputQuality(output);
  return {
    ...decision,
    qualityBand: assignQualityBand(decision.score),
  };
}
