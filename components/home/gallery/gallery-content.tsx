import CardView from "@/components/shared/card-view";

import { gallerySeedImages, type GallerySeedImage } from "@/components/home/gallery/gallery-images";

type GalleryContentProps = {
  items?: GallerySeedImage[];
};

export default function GalleryContent({ items = gallerySeedImages }: GalleryContentProps) {
  return (
    <section className="px-4 py-10 sm:px-6 md:mx-12.5 md:px-0">
      <div className="mx-auto max-w-480 px-4">
        <CardView items={items} />
      </div>
    </section>
  );
}
