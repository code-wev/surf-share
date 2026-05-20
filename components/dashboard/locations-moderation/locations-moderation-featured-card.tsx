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
    <article className="w-70 overflow-hidden rounded-sm border border-line-weaker bg-surface-muted-100 shadow-[0_14px_30px_rgba(15,23,42,0.14)] sm:w-[320px]">
      <div className="relative h-36 w-full sm:h-44">
        <Image src={location.previewImage} alt={location.name} fill className="object-cover" />
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-2xl leading-tight font-semibold text-text-strong sm:text-[30px]">
            {location.name}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-text-weak">
            <MapPin size={12} />
            {location.region}, {location.state}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-line-weaker pt-3">
          <p className="text-xs text-text-weak">{location.photosAvailable} Photos Available</p>
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
