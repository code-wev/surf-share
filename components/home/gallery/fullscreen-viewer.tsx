"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { IPhotoResponse } from "@/lib/api/services/photo.service";
import { getAbsoluteImageUrl } from "@/lib/utils";

type FullscreenImageViewerProps = {
  initialPhoto: IPhotoResponse;
  allPhotos: IPhotoResponse[];
  onClose: () => void;
};

export default function FullscreenImageViewer({
  initialPhoto,
  allPhotos,
  onClose,
}: FullscreenImageViewerProps) {
  const [currentPhoto, setCurrentPhoto] = useState(initialPhoto);

  const currentIndex = allPhotos.findIndex((p) => p.id === currentPhoto.id);
  const prevPhoto = currentIndex > 0 ? allPhotos[currentIndex - 1] : null;
  const nextPhoto = currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1] : null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prevPhoto) setCurrentPhoto(prevPhoto);
      if (e.key === "ArrowRight" && nextPhoto) setCurrentPhoto(nextPhoto);
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose, prevPhoto, nextPhoto]);

  // Default dimensions
  const imgWidth = currentPhoto.width || 1200;
  const imgHeight = currentPhoto.height || 800;
  const aspectRatio = imgWidth / imgHeight;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/65 p-4 backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      {/* Navigation Controls */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-10000 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white/20 active:scale-95"
        aria-label="Close viewer"
      >
        <X className="h-8 w-8 drop-shadow-2xl" strokeWidth={2.5} />
      </button>

      {prevPhoto && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentPhoto(prevPhoto);
          }}
          className="fixed top-1/2 left-8 z-10000 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white/20 active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-10 w-10" />
        </button>
      )}

      {nextPhoto && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentPhoto(nextPhoto);
          }}
          className="fixed top-1/2 right-8 z-10000 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-opacity hover:scale-110 hover:bg-white/20 active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="h-10 w-10" />
        </button>
      )}

      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Container that strictly matches image aspect ratio and fits viewport */}
        <div
          className="relative max-h-full max-w-full shadow-2xl"
          style={{
            aspectRatio: `${imgWidth}/${imgHeight}`,
            width: aspectRatio > 1 ? "100%" : "auto",
            height: aspectRatio <= 1 ? "100%" : "auto",
            containerType: "size",
          }}
        >
          <Image
            src={getAbsoluteImageUrl(currentPhoto.imageUrl)}
            alt={`Photo at ${currentPhoto.location?.name || "Unknown"}`}
            fill
            className="object-contain"
            quality={100}
            unoptimized
            draggable={false}
          />

          {/* Watermark */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden px-[10cqw] select-none">
            <span className="rotate-[-20deg] text-[19cqmin] font-black tracking-tight text-white/30 drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
              surfshare
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
