import Image from "next/image";
import { MapPin } from "lucide-react";

import type { LocationModerationItem } from "@/components/dashboard/locations-moderation/locations-moderation-types";

type LocationsModerationFeaturedCardProps = {
  location: LocationModerationItem;
  onViewGallery: () => void;
};

export default function LocationsModerationFeaturedCard({
  location,
  onViewGallery,
}: LocationsModerationFeaturedCardProps) {
  return (
    <article className="absolute top-3 left-1/2 z-600 w-[calc(100%-1.5rem)] max-w-[320px] -translate-x-1/2 overflow-hidden rounded-sm border border-[#d6dde8] bg-[#dde5ef] p-3 shadow-[0_16px_28px_rgba(15,23,42,0.14)] sm:top-6 sm:w-[320px] sm:max-w-86.25 sm:p-4 md:left-4 md:w-75 md:max-w-none md:translate-x-0 lg:left-6 lg:top-7 lg:w-[320px] lg:p-5 xl:left-[38%]">
      <div className="relative h-44 w-full sm:h-56 md:h-64 lg:h-70">
        <Image src={location.previewImage} alt={location.name} fill className="object-cover" />
      </div>

      <div className="pt-4 sm:pt-5 lg:pt-6">
        <h3 className="text-[22px] leading-[1.06] font-semibold tracking-tight text-text-strong sm:text-[26px] md:text-[28px]">
          {location.name}
        </h3>

        <p className="text-text-weak inline-flex items-center gap-2 text-sm sm:text-[16px] md:text-[18px] [font-family:var(--font-sf-pro)]">
          <MapPin size={16} className="sm:h-4.5 sm:w-4.5" />
          {location.region}, {location.state}
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between lg:mt-6">
          <p className="text-sm text-text-weak sm:text-base lg:text-lg [font-family:var(--font-sf-pro)]">
            {location.photosAvailable}+ Photos Available
          </p>
          <button
            type="button"
            onClick={onViewGallery}
            className="inline-flex h-10 items-center justify-center rounded-sm bg-brand-default px-4 text-sm text-text-inverse-strong transition-colors cursor-pointer hover:bg-brand-hover sm:h-8 sm:px-5 sm:text-xs"
          >
            View Gallery
          </button>
        </div>
      </div>
    </article>
  );
}
