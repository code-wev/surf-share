"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useRef, useState } from "react";
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  MapPin,
  ShoppingCart,
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
import { PageTitle } from "@/components/shared/page-title";

type GalleryDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default function GalleryDetailsPage({ params }: GalleryDetailsPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const detailItem = findGalleryDetailItemBySlugOrId(slug);
  const [favoriteActive, setFavoriteActive] = useState(false);

  const handleThumbnailArrowClick = (direction: -1 | 1) => {
    const strip = thumbnailStripRef.current;
    if (!strip) return;

    const maxScrollableLeft = strip.scrollWidth - strip.clientWidth;

    if (maxScrollableLeft <= 0) {
      router.push(direction === 1 ? `/gallery/${nextItem.slug}` : `/gallery/${prevItem.slug}`);
      return;
    }

    const firstThumbnail = strip.querySelector("a") as HTMLElement | null;
    const step = firstThumbnail ? firstThumbnail.offsetWidth + 8 : 280;
    const targetLeft = Math.min(
      maxScrollableLeft,
      Math.max(0, strip.scrollLeft + direction * step * 2),
    );

    strip.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  if (!detailItem) {
    return (
      <section className="mx-auto w-full max-w-400 py-10 lg:px-8 lg:py-16">
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
    <section className="mx-5 py-6 md:mx-12.5 lg:px-8 lg:py-10">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-(--color-text-weak)">
        <Link href="/gallery" className="font-medium hover:text-(--color-text-brand-strong)">
          Gallery
        </Link>
        <span>&gt;</span>
        <span className="text-sm font-semibold text-(--color-text-strong)">Image details</span>
      </div>

      <div className="grid gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="mx-auto w-full max-w-80 sm:max-w-150 md:max-w-2xl lg:max-w-none">
          <div className="relative overflow-hidden rounded-md border border-(--color-line-weaker)">
            <Image
              src={detailItem.src}
              alt={detailItem.alt}
              width={1800}
              height={1200}
              className="h-56 w-full object-cover sm:h-80 lg:h-188"
              quality={100}
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 70vw, 1200px"
              unoptimized
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              priority
            />

            <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-black/10" />

            <div className="pointer-events-none absolute inset-0 z-20 select-none">
              <Image
                src="/surfshare.png"
                alt="Surfshare watermark"
                width={1000}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]"
                draggable={false}
              />
            </div>

            <button
              type="button"
              aria-label="Previous image"
              className="pointer-events-auto absolute top-1/2 left-2 z-30 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-(--color-text-strong) shadow sm:left-3 sm:h-9 sm:w-9"
              onClick={() => router.push(`/gallery/${prevItem.slug}`)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="Next image"
              className="pointer-events-auto absolute top-1/2 right-2 z-30 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-(--color-text-strong) shadow sm:right-3 sm:h-9 sm:w-9"
              onClick={() => router.push(`/gallery/${nextItem.slug}`)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-3">
            <button
              type="button"
              aria-label="Scroll thumbnails left"
              className="pointer-events-auto absolute top-1/2 left-2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-(--color-line-weaker) bg-white/95 text-(--color-text-strong) shadow sm:inline-flex"
              onClick={() => handleThumbnailArrowClick(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              ref={thumbnailStripRef}
              className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-12 [&::-webkit-scrollbar]:hidden"
            >
              {moreImages.map((image) => (
                <Link
                  key={image.id}
                  href={`/gallery/${image.slug}`}
                  className={
                    image.id === detailItem.id
                      ? "relative h-18 w-24 shrink-0 snap-start overflow-hidden rounded-md ring-2 ring-(--color-line-brand) sm:h-20 sm:w-32"
                      : "relative h-18 w-24 shrink-0 snap-start overflow-hidden rounded-md opacity-85 hover:opacity-100 sm:h-20 sm:w-32"
                  }
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={320}
                    height={220}
                    className="h-full w-full object-cover"
                    quality={100}
                    sizes="(max-width: 640px) 96px, 128px"
                    unoptimized
                    draggable={false}
                    onContextMenu={(event) => event.preventDefault()}
                  />
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/10" />

                  <div className="pointer-events-none absolute inset-0 z-10 select-none">
                    <Image
                      src="/surfshare.png"
                      alt="Surfshare watermark"
                      width={220}
                      height={54}
                      className="absolute top-1 left-2 w-20 opacity-85 drop-shadow-[0_5px_12px_rgba(0,0,0,0.45)] sm:w-28"
                      draggable={false}
                    />
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              aria-label="Scroll thumbnails right"
              className="pointer-events-auto absolute top-1/2 right-2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-(--color-line-weaker) bg-white/95 text-(--color-text-strong) shadow sm:inline-flex"
              onClick={() => handleThumbnailArrowClick(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="bg-(--color-surface-base)">
          <PageTitle
            subtitlePosition="top"
            subtitle={detailItem.details.title}
            subtitleClassName="text-lg! leading-tight text-(--color-text-weak) sm:text-2xl! lg:text-[28px]!"
            title={detailItem.price ?? `$${detailItem.priceValue.toFixed(2)}`}
            titleClassName="text-(--color-text-brand-strong) text-[34px]! leading-none sm:text-[46px]! lg:text-[58px]!"
          />

          <div className="mt-6 space-y-3 text-sm text-(--color-text-weak)">
            <PageTitle
              beforeTitle={<MapPin className="h-5 w-5" color="#0C3173" />}
              subtitle="location"
              subtitlePosition="top"
              title={detailItem.location}
              titleClassName="text-base! text-(--color-text-strong) -mt-4 font-medium!"
              subtitleClassName="text-sm! text-(--color-text-weak)"
            />
            <PageTitle
              beforeTitle={<Calendar className="h-5 w-5" color="#0C3173" />}
              subtitle="Date Taken"
              subtitlePosition="top"
              title={detailItem.details.dateTaken}
              titleClassName="text-base! text-(--color-text-strong) -mt-4 font-medium!"
              subtitleClassName="text-sm! text-(--color-text-weak)"
            />
            <PageTitle
              beforeTitle={<Camera className="h-5 w-5" color="#0C3173" />}
              subtitle="Photographer"
              subtitlePosition="top"
              title={detailItem.details.photographer}
              titleClassName="text-base! text-(--color-text-strong) -mt-4 font-medium!"
              subtitleClassName="text-sm! text-(--color-text-weak)"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              variant="secondary"
              className={
                favoriteActive
                  ? "h-10 cursor-pointer border border-(--color-line-brand) bg-(--color-fill-inverse-weak) text-(--color-text-white)"
                  : "h-10 cursor-pointer border border-(--color-line-weaker) bg-(--color-fill-inverse-weak) text-(--color-text-brand-strong)"
              }
              onClick={() => setFavoriteActive((previousValue) => !previousValue)}
            >
              Add to favorites
              <Heart className="h-4 w-4" />
            </Button>
            <Button className="h-10 cursor-pointer bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong) hover:opacity-95">
              Add to cart
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 border-t border-(--color-line-weaker) pt-5">
            <h2 className="text-2xl font-semibold text-(--color-text-strong) sm:text-[28px]">
              Image Specifications
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <dt className="text-sm text-(--color-text-weak) sm:text-base">Resolution</dt>
                <dd className="text-right text-sm font-medium text-(--color-text-strong) sm:text-base">
                  {detailItem.details.resolution}
                </dd>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <dt className="text-sm text-(--color-text-weak) sm:text-base">Format</dt>
                <dd className="text-right text-sm font-medium text-(--color-text-strong) sm:text-base">
                  {detailItem.details.format}
                </dd>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <dt className="text-sm text-(--color-text-weak) sm:text-base">Size</dt>
                <dd className="text-right text-sm font-medium text-(--color-text-strong) sm:text-base">
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
              className="h-28 w-full object-cover sm:h-30"
              quality={100}
              sizes="(max-width: 640px) 100vw, 480px"
              unoptimized
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
            />

            <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-black/10" />

            <div className="pointer-events-none absolute inset-0 z-20 select-none">
              <Image
                src="/surfshare.png"
                alt="Surfshare watermark"
                width={320}
                height={80}
                className="absolute top-2 left-3 w-24 opacity-85 drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] sm:w-36"
                draggable={false}
              />
            </div>
            <Link
              href="/gallery"
              aria-label="Open gallery"
              className="absolute top-2 right-2 z-30 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-(--color-text-brand-strong) sm:h-8 sm:w-8"
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
