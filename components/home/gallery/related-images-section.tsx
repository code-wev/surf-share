"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Heart, Plus } from "lucide-react";

import ImageCard from "@/components/shared/image-card";
import type { GalleryDetailItem } from "@/components/home/gallery/gallery-images";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

type RelatedImagesSectionProps = {
  items: GalleryDetailItem[];
  onNavigate?: (id: string) => void;
};

function BuildActions() {
  const { session } = useAuth();

  // Hide actions for Photographers, Moderators, and Admins
  const isContributorOrStaff =
    session?.role === "PHOTOGRAPHER" || session?.role === "MODERATOR" || session?.role === "ADMIN";

  if (isContributorOrStaff) {
    return null;
  }

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
    <div className="flex items-end justify-between gap-6">
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

        <div className="mt-1 flex items-center gap-1 text-xs text-white/85 sm:text-[13px]">
          <span>{item.location}</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </div>

      <p className="text-3xl leading-none font-semibold text-white sm:text-3xl lg:text-4xl">
        {item.price}
      </p>
    </div>
  );
}

export default function RelatedImagesSection({ items, onNavigate }: RelatedImagesSectionProps) {
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const [activePage, setActivePage] = useState(0);
  const currentPage = Math.min(activePage, totalPages - 1);

  const pagedItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, items]);

  return (
    <section className="mx-5 mt-10 max-w-480 bg-(--color-surface-base) py-6 sm:py-8 md:mx-12.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageTitle
          subtitlePosition="top"
          subtitle="Captured around the same location"
          subtitleClassName="text-lg! leading-tight text-(--color-text-weak) sm:text-2xl! lg:text-[28px]!"
          title=" Related Photos"
          titleClassName="text-(--color-text-strong) text-[34px]! leading-none sm:text-[46px]! lg:text-[58px]!"
        />

        <Link href="/gallery" scroll={false}>
          <Button className="mt-12 cursor-pointer rounded-lg border border-(--color-line-weaker) bg-transparent px-5 py-2 text-sm text-(--color-text-brand-strong) transition-colors duration-200 hover:bg-(--color-fill-brand-strong) hover:text-white hover:shadow-lg">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pagedItems.map((item) => (
          <div 
            key={item.id} 
            className="h-80 sm:h-66 cursor-pointer"
            onClick={() => onNavigate?.(String(item.id))}
          >
            <ImageCard
              src={item.src}
              alt={item.alt}
              href={onNavigate ? undefined : `/gallery/${item.slug}`}
              width={800}
              height={600}
              className="h-full rounded-sm"
              imageClassName="h-full w-full object-cover"
              info={buildInfo(item)}
              actions={<BuildActions />}
              actionsClassName="opacity-100"
            />
          </div>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Show related photos page ${dotIndex + 1}`}
              aria-current={dotIndex === currentPage}
              className={
                dotIndex === currentPage
                  ? "inline-block h-3 w-3 rounded-full bg-(--color-fill-brand-strong)"
                  : "inline-block h-3 w-3 rounded-full bg-(--color-icon-disable) transition-colors hover:bg-(--color-fill-strong)"
              }
              onClick={() => setActivePage(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
