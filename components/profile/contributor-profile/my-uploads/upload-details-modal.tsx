"use client";

import Image from "next/image";
import { CalendarDays, Camera, MapPin, X } from "lucide-react";
import { PageTitle } from "@/components/shared/page-title";

type ContributorUploadDetails = {
  id: string;
  name: string;
  photoUrl: string;
  location: string;
  dateLabel: string;
  priceLabel: string;
  photographer: string;
  resolution: string;
  format: string;
  size: string;
};

type ContributorUploadDetailsModalProps = {
  upload: ContributorUploadDetails | null;
  onClose: () => void;
};

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
      <p className="text-text-weak">{label}</p>
      <p className="text-text-strong text-right">{value}</p>
    </div>
  );
}

export default function UploadDetailsModal({
  upload,
  onClose,
}: ContributorUploadDetailsModalProps) {
  if (!upload) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-6 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Upload details"
        onClick={(event) => event.stopPropagation()}
        className="border-line-weaker bg-surface-muted-100 h-200 w-full max-w-260 overflow-hidden rounded-lg border shadow-[0_20px_50px_rgba(15,23,42,0.25)] md:h-auto"
      >
        <div className="border-line-weaker flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-text-strong text-base font-semibold">Upload Details</h2>
          <button
            type="button"
            aria-label="Close upload details"
            onClick={onClose}
            className="border-line-weaker text-text-strong hover:bg-fill-hover inline-flex h-8 w-8 items-center justify-center rounded-sm border"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-5 p-4 md:grid-cols-[1.4fr_1fr] md:gap-8 md:p-6">
          {/* Left Side */}
          <div className="relative h-110 overflow-hidden rounded-sm">
            <Image
              src={upload.photoUrl}
              alt={upload.name}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
            />
          </div>
          {/* Right Side */}
          <div>
            <PageTitle
              subtitlePosition="top"
              subtitle={upload.name}
              subtitleClassName="text-lg! leading-tight text-(--color-text-weak) sm:text-2xl! lg:text-[28px]!"
              title={`${upload.priceLabel}.00`}
              titleClassName="text-(--color-text-brand-strong) text-[34px]! leading-none sm:text-[46px]! lg:text-[58px]!"
            />

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-text-weaker mt-0.5" />
                <div>
                  <p className="text-text-weaker text-xs">Location</p>
                  <p className="text-text-strong text-sm">{upload.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CalendarDays size={14} className="text-text-weaker mt-0.5" />
                <div>
                  <p className="text-text-weaker text-xs">Date Taken</p>
                  <p className="text-text-strong text-sm">{upload.dateLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Camera size={14} className="text-text-weaker mt-0.5" />
                <div>
                  <p className="text-text-weaker text-xs">Photographer</p>
                  <p className="text-text-strong text-sm">{upload.photographer}</p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h4 className="text-text-strong text-[22px] font-semibold">Image Specifications</h4>
              <div className="mt-3 space-y-2">
                <DetailItem label="Resolution" value={upload.resolution} />
                <DetailItem label="Format" value={upload.format} />
                <DetailItem label="Size" value={upload.size} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
