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
    <article className="absolute top-1/2 left-1/2 z-600 w-[calc(100%-1.5rem)] max-w-86.25 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-[#d6dde8] bg-[#dde5ef] shadow-[0_16px_28px_rgba(15,23,42,0.14)] sm:w-86.25 lg:left-[40%] lg:max-w-none p-5">
      <div className="relative h-70 w-full">
        <Image src={location.previewImage} alt={location.name} fill className="object-cover" />
      </div>

      <div className="pt-6">
        <h3 className="text-[28px] leading-[1.06] font-semibold tracking-tight text-text-strong">
          {location.name}
        </h3>

        <p className="text-text-weak inline-flex items-center gap-2 text-[18px] family-[var(--font-sf-pro)]">
          <MapPin size={18} />
          {location.region}, {location.country}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-lg text-text-weak family-[var(--font-sf-pro)]">{location.photosAvailable}+ Photos Available</p>
          <button
            type="button"
            onClick={onViewGallery}
            className="inline-flex items-center rounded-sm bg-brand-default px-5 py-2.5 text-sm text-text-inverse-strong transition-colors cursor-pointer"
          >
            View Gallery
          </button>
        </div>
      </div>
    </article>
  );
}
