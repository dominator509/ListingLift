export type ProcessingProgressSnapshot = {
  totalImages: number;
  totalRequestedOutputs: number;
  totalCreatedOutputs: number;
  totalFailedOutputs: number;
  status: string;
};

export function calculateProcessingProgress(snapshot: ProcessingProgressSnapshot) {
  const total = Math.max(snapshot.totalRequestedOutputs, 0);
  const done = Math.max(snapshot.totalCreatedOutputs + snapshot.totalFailedOutputs, 0);
  return {
    percent: total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100)),
    done,
    total,
    failed: snapshot.totalFailedOutputs,
    complete: total > 0 && done >= total,
    status: snapshot.status,
  };
}
