import { EmptyState } from '@/components/ui/empty-state';
import { PreviewOutputCard } from './preview-output-card';
import type { PreviewGalleryItem } from '@/domain/preview-gallery';

export function PreviewGalleryGrid({ items, selectable = false }: { items: PreviewGalleryItem[]; selectable?: boolean }) {
  if (!items.length) {
    return <EmptyState title="No preview outputs available" description="Preview outputs appear after processing creates reviewable files. Client views only show approved previews when preview access is enabled." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => <PreviewOutputCard key={item.id} item={item} selectable={selectable} />)}
    </div>
  );
}
