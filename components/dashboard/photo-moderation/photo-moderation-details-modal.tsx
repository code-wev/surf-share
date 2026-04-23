"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";

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
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 text-xs leading-tight sm:text-sm">
      <p className="text-text-weaker">{label}</p>
      <p className="text-text-strong min-w-0 text-right">{value}</p>
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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} photo details`}
        onClick={(event) => event.stopPropagation()}
        className="border-line-weaker w-full max-w-330 overflow-hidden rounded-sm border bg-white shadow-[0_20px_50px_rgba(15,23,42,0.25)]"
      >
        <div className="grid gap-6 p-5 md:grid-cols-[1.15fr_0.85fr] md:gap-8 md:p-6 lg:gap-10">
          <div>
            <div className="bg-fill-hover relative overflow-hidden rounded-sm">
              <div className="relative aspect-[1.35/1] w-full">
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

            <div className="relative mt-4">
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
                className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-11 pb-1"
              >
                {item.images.map((imageSrc, index) => (
                  <button
                    key={`${imageSrc}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(imageSrc)}
                    className={`relative h-18 w-20 shrink-0 overflow-hidden rounded-sm border transition ${
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

          <div className="flex flex-col justify-between gap-6 py-2 md:py-1">
            <div>
              <PageTitle
                title={item.title}
                subtitle={item.priceLabel}
                subtitlePosition="bottom"
                titleClassName="text-2xl font-medium leading-tight text-text-strong sm:text-[28px] lg:text-[32px]"
                subtitleClassName="text-[34px] font-semibold leading-none text-brand-default sm:text-[42px] lg:text-[56px]"
              />

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-text-weaker mt-0.5 shrink-0" />
                  <div>
                    <p className="text-text-weaker text-xs">Location</p>
                    <p className="text-text-strong text-sm">{item.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="border-text-weaker text-text-weaker mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border text-center text-[9px] leading-3">
                    1
                  </div>
                  <div>
                    <p className="text-text-weaker text-xs">Date Taken</p>
                    <p className="text-text-strong text-sm">{item.dateTaken}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="border-text-weaker text-text-weaker mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border text-center text-[9px] leading-3">
                    2
                  </div>
                  <div>
                    <p className="text-text-weaker text-xs">Photographer</p>
                    <p className="text-text-strong text-sm">{item.photographer}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-text-strong text-[22px] font-medium">Image Specifications</h3>
                <div className="mt-3 space-y-2">
                  <DetailRow label="Resolution" value={item.resolution} />
                  <DetailRow label="Format" value={item.format} />
                  <DetailRow label="Size" value={item.size} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 sm:w-75">
              <button
                type="button"
                onClick={() => onAction(item.id, "reject")}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-sm bg-[#FDE7E7] px-3 text-xs font-medium text-[#D85B5B] transition hover:opacity-90"
              >
                Reject
                <X size={12} />
              </button>

              <button
                type="button"
                onClick={() => onAction(item.id, "approve")}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-sm bg-[#EAF8EE] px-3 text-xs font-medium text-[#2AA65C] transition hover:opacity-90"
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
