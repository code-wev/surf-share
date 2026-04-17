import CardView from "@/components/shared/card-view";

import {
  galleryDetailItems,
  gallerySeedImages,
  type GallerySeedImage,
} from "@/components/home/gallery/gallery-images";

type GalleryContentProps = {
  items?: GallerySeedImage[];
};

const gallerySlugById = new Map(galleryDetailItems.map((item) => [String(item.id), item.slug]));

export default function GalleryContent({ items = gallerySeedImages }: GalleryContentProps) {
  const itemsWithSlugs = items.map((item) => ({
    ...item,
    slug: gallerySlugById.get(String(item.id)) ?? item.slug,
  }));

  return (
    <section className="px-4 py-10 sm:px-6 md:mx-12.5 md:px-0">
      <div className="mx-auto max-w-480 px-4">
        <CardView items={itemsWithSlugs} />
      </div>
    </section>
  );
}
