"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { usePublicPhotosQuery } from "@/hooks/api/usePhotos";
import { getAbsoluteImageUrl } from "@/lib/utils";
import type { IPhotoResponse } from "@/lib/api/services/photo.service";

type ThumbnailFilmstripProps = {
  currentPhotoId: string;
  onNavigate?: (id: string) => void;
};

export default function ThumbnailFilmstrip({ currentPhotoId, onNavigate }: ThumbnailFilmstripProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch approved photos - reasonable limit for filmstrip
  const { data: photosResponse, isLoading } = usePublicPhotosQuery({
    limit: 50,
  });

  const photos = (photosResponse?.data || []) as IPhotoResponse[];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleNavigate = (photoId: string) => {
    if (onNavigate) {
      onNavigate(photoId);
    } else {
      router.push(`/gallery/${photoId}`, { scroll: false });
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 flex w-full gap-2 overflow-hidden px-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-16 shrink-0 animate-pulse rounded-md bg-white/40 sm:h-20 sm:w-20"
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) return null;

  return (
    <div className="group relative mt-4 flex w-full items-center rounded-lg border border-white/20 bg-white/80 p-1.5 shadow-sm backdrop-blur-sm sm:p-2">
      {/* Scroll Left Button - Hidden on mobile, native swipe preferred */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-2 z-10 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white active:scale-95 sm:-left-4 sm:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Thumbnails Container */}
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex w-full gap-2 overflow-x-auto scroll-smooth px-0.5 py-0.5 sm:gap-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {photos.map((photo: IPhotoResponse) => (
          <button
            key={photo.id}
            onClick={() => handleNavigate(photo.id)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 sm:h-20 sm:w-20 ${
              photo.id === currentPhotoId
                ? "z-10 scale-105 border-(--color-fill-brand-strong) shadow-sm"
                : "border-transparent hover:border-gray-200"
            }`}
          >
            <Image
              src={getAbsoluteImageUrl(photo.imageUrl)}
              alt={photo.title || "Thumbnail"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, 80px"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Scroll Right Button - Hidden on mobile */}
      <button
        onClick={() => scroll("right")}
        className="absolute -right-2 z-10 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white active:scale-95 sm:-right-4 sm:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </button>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
