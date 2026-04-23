"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CalendarDays, Camera, Check, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";

import { PageTitle } from "@/components/shared/page-title";
import type {
  ModerationAction,
  PhotoModerationItem,
} from "@/components/dashboard/photo-moderation/photo-moderation-types";

type PhotoModerationDetailsModalProps = {
  item: PhotoModerationItem | null;
  onClose: () => void;
  onAction: (id: number, action: ModerationAction) => void;
};

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-2 text-xs leading-tight sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-3 sm:text-sm">
      <p className="text-text-weaker">{label}</p>
      <p className="text-text-strong min-w-0 text-left wrap-break-word sm:text-right">{value}</p>
    </div>
  );
}

export default function PhotoModerationDetailsModal({
  item,
  onClose,
  onAction,
}: PhotoModerationDetailsModalProps) {
  const thumbnailListRef = useRef<HTMLDivElement | null>(null);
  const [activeImage, setActiveImage] = useState(() => item?.images[0] ?? item?.imageSrc ?? "");

  if (!item) {
    return null;
  }

  const currentImage = activeImage || item.images[0] || item.imageSrc;

  const scrollThumbnails = (direction: "left" | "right") => {
    const container = thumbnailListRef.current;

    if (!container) {
      return;
    }

    const offset =
      direction === "left" ? -container.clientWidth * 0.75 : container.clientWidth * 0.75;
    container.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-black/45 p-2 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} photo details`}
        onClick={(event) => event.stopPropagation()}
        className="border-line-weaker relative my-2 max-h-[calc(100dvh-1rem)] w-[calc(100vw-0.75rem)] max-w-270 overflow-y-auto rounded-sm border bg-white shadow-[0_24px_60px_rgba(15,23,42,0.28)] sm:my-0 sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] lg:w-[calc(100vw-4rem)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo details"
          className="border-line-weaker text-text-strong hover:bg-fill-hover absolute top-3 right-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-sm transition"
        >
          <X size={16} />
        </button>

        <div className="grid gap-4 p-3 pt-12 sm:gap-6 sm:p-5 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:p-6 lg:pt-14 xl:gap-10">
          <div>
            <div className="bg-fill-hover border-line-weaker/60 relative overflow-hidden rounded-sm border">
              <div className="relative aspect-[1.2/1] w-full sm:aspect-[1.35/1]">
                <Image
                  src={currentImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 680px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="relative mt-3 sm:mt-4">
              <button
                type="button"
                onClick={() => scrollThumbnails("left")}
                className="text-text-strong absolute top-1/2 left-2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => scrollThumbnails("right")}
                className="text-text-strong absolute top-1/2 right-2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
                aria-label="Scroll thumbnails right"
              >
                <ChevronRight size={16} />
              </button>

              <div
                ref={thumbnailListRef}
                className="no-scrollbar flex gap-1.5 overflow-x-auto scroll-smooth px-9 pb-1 sm:gap-2 sm:px-11"
              >
                {item.images.map((imageSrc, index) => (
                  <button
                    key={`${imageSrc}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(imageSrc)}
                    className={`relative h-14 w-16 shrink-0 overflow-hidden rounded-sm border transition sm:h-18 sm:w-20 ${
                      currentImage === imageSrc ? "border-brand-default" : "border-transparent"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={imageSrc}
                      alt={`${item.title} thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 py-1 sm:gap-6 lg:py-1">
            <div>
              <PageTitle
                title={item.title}
                subtitle={item.priceLabel}
                subtitlePosition="bottom"
                titleClassName="text-xl font-semibold leading-tight text-text-strong sm:text-[28px] lg:text-[32px]"
                subtitleClassName="text-3xl font-bold leading-none text-brand-default sm:text-[42px] lg:text-[56px]"
              />

              <div className="border-line-weaker/70 bg-surface-muted-100 mt-4 space-y-2.5 rounded-sm border p-3 sm:mt-6 sm:space-y-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-text-weaker mt-0.5 shrink-0" />
                  <div>
                    <p className="text-text-weaker text-xs">Location</p>
                    <p className="text-text-strong text-sm">{item.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CalendarDays size={14} className="text-text-weaker mt-0.5 shrink-0" />
                  <div>
                    <p className="text-text-weaker text-xs">Date Taken</p>
                    <p className="text-text-strong text-sm">{item.dateTaken}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Camera size={14} className="text-text-weaker mt-0.5 shrink-0" />
                  <div>
                    <p className="text-text-weaker text-xs">Photographer</p>
                    <p className="text-text-strong text-sm">{item.photographer}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-10">
                <h3 className="text-text-strong text-lg font-medium sm:text-[22px]">
                  Image Specifications
                </h3>
                <div className="border-line-weaker/70 bg-surface-muted-100 mt-3 space-y-2 rounded-sm border p-3 sm:p-4">
                  <DetailRow label="Resolution" value={item.resolution} />
                  <DetailRow label="Format" value={item.format} />
                  <DetailRow label="Size" value={item.size} />
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 pt-1 sm:gap-3 sm:pt-2">
              <button
                type="button"
                onClick={() => onAction(item.id, "reject")}
                className="inline-flex h-9 items-center justify-center gap-1 rounded-sm bg-[#FDE7E7] px-2 text-[11px] font-medium text-[#D85B5B] transition hover:opacity-90 sm:gap-2 sm:px-3 sm:text-xs"
              >
                Reject
                <X size={12} />
              </button>

              <button
                type="button"
                onClick={() => onAction(item.id, "approve")}
                className="inline-flex h-9 items-center justify-center gap-1 rounded-sm bg-[#EAF8EE] px-2 text-[11px] font-medium text-[#2AA65C] transition hover:opacity-90 sm:gap-2 sm:px-3 sm:text-xs"
              >
                Approve
                <Check size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
