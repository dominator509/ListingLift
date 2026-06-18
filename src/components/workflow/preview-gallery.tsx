import { EmptyState } from '@/components/ui/empty-state';
import { ImageCard, type ImageCardStatus } from './image-card';

export type PreviewGalleryItem = {
  id: string;
  title: string;
  subtitle?: string;
  status?: ImageCardStatus;
  meta?: string[];
};

export function PreviewGallery({ items }: { items: PreviewGalleryItem[] }) {
  if (!items.length) {
    return <EmptyState title="No previews generated yet" description="Preview images will appear after the processing phase creates outputs and the admin queue is ready for review." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => <ImageCard key={item.id} title={item.title} subtitle={item.subtitle} status={item.status} meta={item.meta} />)}
    </div>
  );
}
