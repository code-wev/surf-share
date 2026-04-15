import GalleryContent from "@/components/home/gallery/gallery-content";
import GalleryPagination from "@/components/home/gallery/gallery-pagination";
import GalleryTitle from "@/components/home/gallery/gallery-title";

export default function GalleryPage() {
  return (
    <>
      <GalleryTitle />
      <GalleryContent />
      <GalleryPagination />
    </>
  );
}
