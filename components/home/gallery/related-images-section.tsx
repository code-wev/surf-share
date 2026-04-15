import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Heart, Plus } from "lucide-react";

import ImageCard from "@/components/shared/image-card";
import type { GalleryDetailItem } from "@/components/home/gallery/gallery-images";

type RelatedImagesSectionProps = {
  items: GalleryDetailItem[];
};

function buildActions() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Add to favourites"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/55 bg-[#E7E5E4] text-(--color-fill-brand-strong) transition-colors hover:bg-(--color-fill-brand-strong) hover:text-white"
      >
        <Heart className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Add to cart"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/55 bg-[#E7E5E4] text-(--color-fill-brand-strong) transition-colors hover:bg-(--color-fill-brand-strong) hover:text-white"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function buildInfo(item: GalleryDetailItem) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {item.avatarSrc ? (
            <Image
              src={item.avatarSrc}
              alt={item.userName ?? "Photographer"}
              width={26}
              height={26}
              className="h-6 w-6 rounded-full border border-white/50 object-cover"
            />
          ) : null}
          <p className="truncate text-[28px] leading-none font-medium text-white">
            {item.userName}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-1 text-[13px] text-white/85">
          <span>{item.location}</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </div>

      <p className="text-[40px] leading-none font-semibold text-white">{item.price}</p>
    </div>
  );
}

export default function RelatedImagesSection({ items }: RelatedImagesSectionProps) {
  return (
    <section className="mt-10 rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-(--color-text-weak)">
            Captured around the same location
          </p>
          <h2 className="mt-1 text-4xl font-semibold tracking-tight text-(--color-text-strong)">
            Related Photos
          </h2>
        </div>

        <Link
          href="/gallery"
          className="inline-flex h-8 items-center justify-center rounded-md border border-(--color-line-weaker) px-3 text-xs font-medium text-(--color-text-brand-strong)"
        >
          View All
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className="h-66">
            <ImageCard
              src={item.src}
              alt={item.alt}
              href={`/gallery/${item.slug}`}
              width={800}
              height={600}
              className="h-full rounded-sm"
              imageClassName="h-full w-full object-cover"
              info={buildInfo(item)}
              actions={buildActions()}
              actionsClassName="opacity-100"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {[0, 1, 2, 3, 4].map((dotIndex) => (
          <span
            key={dotIndex}
            className={
              dotIndex === 0
                ? "inline-block h-3 w-3 rounded-full bg-(--color-fill-brand-strong)"
                : "inline-block h-3 w-3 rounded-full bg-(--color-fill-disabled)"
            }
          />
        ))}
      </div>
    </section>
  );
}
