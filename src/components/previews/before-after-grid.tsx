import { EmptyState } from '@/components/ui/empty-state';
import { BeforeAfterPreviewCard } from './before-after-preview-card';
import type { BeforeAfterPair } from '@/domain/preview-gallery';

export function BeforeAfterGrid({ pairs }: { pairs: BeforeAfterPair[] }) {
  if (!pairs.length) return <EmptyState title="No before/after pairs yet" description="Pairs are generated from original images and processed outputs sharing the same image ID." />;
  return <div className="grid gap-5 xl:grid-cols-2">{pairs.map((pair) => <BeforeAfterPreviewCard key={pair.imageId} pair={pair} />)}</div>;
}
