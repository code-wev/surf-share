"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  MapPin,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  findGalleryDetailItemBySlugOrId,
  getMoreGalleryImagesBySlugOrId,
  getRelatedGalleryImagesBySlugOrId,
  galleryDetailItems,
} from "@/components/home/gallery/gallery-images";
import RelatedImagesSection from "@/components/home/gallery/related-images-section";
import { Button } from "@/components/ui/button";

type GalleryDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default function GalleryDetailsPage({ params }: GalleryDetailsPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const detailItem = findGalleryDetailItemBySlugOrId(slug);
  const [favoriteActive, setFavoriteActive] = useState(false);

  if (!detailItem) {
    return (
      <section className="px-4 py-10 sm:px-6 md:mx-12.5 md:px-0 md:py-25">
        <div className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-6">
          <p className="text-sm text-(--color-text-weak)">Image not found.</p>
          <Link
            href="/gallery"
            className="mt-2 inline-block text-sm font-medium text-(--color-text-brand-strong)"
          >
            Back to gallery
          </Link>
        </div>
      </section>
    );
  }

  const currentIndex = galleryDetailItems.findIndex((item) => item.id === detailItem.id);
  const prevItem =
    galleryDetailItems[(currentIndex - 1 + galleryDetailItems.length) % galleryDetailItems.length];
  const nextItem = galleryDetailItems[(currentIndex + 1) % galleryDetailItems.length];
  const moreImages = getMoreGalleryImagesBySlugOrId(slug, 8);
  const relatedImages = getRelatedGalleryImagesBySlugOrId(slug, 8);

  return (
    <section className="px-4 py-6 sm:px-6 md:mx-12.5 md:px-0 md:py-10">
      <div className="mb-5 flex items-center gap-2 text-xs text-(--color-text-weak)">
        <Link href="/gallery" className="font-medium hover:text-(--color-text-brand-strong)">
          Gallery
        </Link>
        <span>&gt;</span>
        <span className="font-semibold text-(--color-text-strong)">Image details</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative overflow-hidden rounded-md border border-(--color-line-weaker)">
            <Image
              src={detailItem.src}
              alt={detailItem.alt}
              width={1800}
              height={1200}
              className="h-75 w-full object-cover sm:h-115 lg:h-160"
              priority
            />

            <button
              type="button"
              aria-label="Previous image"
              className="absolute top-1/2 left-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-(--color-text-strong) shadow"
              onClick={() => router.push(`/gallery/${prevItem.slug}`)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="Next image"
              className="absolute top-1/2 right-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-(--color-text-strong) shadow"
              onClick={() => router.push(`/gallery/${nextItem.slug}`)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2">
            {moreImages.map((image) => (
              <Link
                key={image.id}
                href={`/gallery/${image.slug}`}
                className={
                  image.id === detailItem.id
                    ? "relative h-18 w-24 shrink-0 overflow-hidden rounded-md ring-2 ring-(--color-line-brand)"
                    : "relative h-18 w-24 shrink-0 overflow-hidden rounded-md opacity-80 hover:opacity-100"
                }
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={320}
                  height={220}
                  className="h-full w-full object-cover"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-4 sm:p-5 lg:p-6">
          <h1 className="text-2xl font-semibold text-(--color-text-strong) sm:text-3xl">
            {detailItem.details.title}
          </h1>
          <p className="mt-1 text-5xl leading-none font-semibold text-(--color-text-brand-strong)">
            {detailItem.price ?? `$${detailItem.priceValue.toFixed(2)}`}
          </p>

          <div className="mt-6 space-y-3 text-sm text-(--color-text-weak)">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-xs">Location</p>
                <p className="font-medium text-(--color-text-strong)">{detailItem.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-xs">Date Taken</p>
                <p className="font-medium text-(--color-text-strong)">
                  {detailItem.details.dateTaken}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <UserRound className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-xs">Photographer</p>
                <p className="font-medium text-(--color-text-strong)">
                  {detailItem.details.photographer}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              variant="secondary"
              className={
                favoriteActive
                  ? "h-10 border border-(--color-line-brand) bg-(--color-fill-brand-strong) text-(--color-text-white)"
                  : "h-10 border border-(--color-line-weaker) bg-(--color-surface-muted-100) text-(--color-text-brand-strong)"
              }
              onClick={() => setFavoriteActive((previousValue) => !previousValue)}
            >
              Add to favourites
              <Heart className="h-4 w-4" />
            </Button>
            <Button className="h-10 bg-(--color-fill-brand-strong) text-(--color-text-white) hover:opacity-95">
              Add to cart
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 border-t border-(--color-line-weaker) pt-5">
            <h2 className="text-2xl font-semibold text-(--color-text-strong)">
              Image Specifications
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-(--color-text-weak)">Resolution</dt>
                <dd className="font-medium text-(--color-text-strong)">
                  {detailItem.details.resolution}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-(--color-text-weak)">Format</dt>
                <dd className="font-medium text-(--color-text-strong)">
                  {detailItem.details.format}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-(--color-text-weak)">Size</dt>
                <dd className="font-medium text-(--color-text-strong)">
                  {detailItem.details.size}
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-md border border-(--color-line-weaker)">
            <Image
              src={detailItem.details.promoImageSrc}
              alt={detailItem.details.promoImageAlt}
              width={960}
              height={280}
              className="h-30 w-full object-cover"
            />
            <Link
              href="/gallery"
              aria-label="Open gallery"
              className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-(--color-text-brand-strong)"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <RelatedImagesSection items={relatedImages} />
    </section>
  );
}
