export type ProcessingQueueItem = {
  jobId: string;
  imageIds: string[];
  presetKeys: string[];
  priority?: 'normal' | 'priority';
};

export function createProcessingQueueItem(input: ProcessingQueueItem) {
  if (!input.jobId) throw new Error('jobId is required.');
  if (input.imageIds.length === 0) throw new Error('At least one image is required.');
  return { ...input, priority: input.priority ?? 'normal', queuedAt: new Date().toISOString() };
}
