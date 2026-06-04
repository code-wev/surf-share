"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

type FullscreenImageViewerProps = {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  onClose: () => void;
};

export default function FullscreenImageViewer({
  src,
  alt,
  width,
  height,
  onClose,
}: FullscreenImageViewerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Default dimensions
  const imgWidth = width || 1200;
  const imgHeight = height || 800;
  const aspectRatio = imgWidth / imgHeight;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      {/* High-visibility Close Button */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-[10000] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white/20 active:scale-95"
        aria-label="Close viewer"
      >
        <X className="h-8 w-8 drop-shadow-2xl" strokeWidth={2.5} />
      </button>

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
            src={src}
            alt={alt}
            fill
            className="object-contain"
            quality={100}
            unoptimized
            draggable={false}
          />

          {/* Watermark - Scaled relative to the smaller container dimension (cqmin) to ensure containment */}
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
