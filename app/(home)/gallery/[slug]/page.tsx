"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import {
  Calendar,
  Camera,
  Clock3,
  ExternalLink,
  Heart,
  MapPin,
  ShoppingCart,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";

import RelatedImagesSection from "@/components/home/gallery/related-images-section";
import ThumbnailFilmstrip from "@/components/home/gallery/thumbnail-filmstrip";
import FullscreenImageViewer from "@/components/home/gallery/fullscreen-viewer";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { usePhotoDetailQuery, usePublicPhotosQuery } from "@/hooks/api/usePhotos";
import { useAdvertisementQuery } from "@/hooks/api/useAdvertisement";
import { useFavoriteIdsQuery, useToggleFavoriteMutation } from "@/hooks/api/useFavorites";
import { usePurchasedPhotoIdsQuery } from "@/hooks/api/useCheckout";
import { useAuth } from "@/lib/auth";
import { useCartStore } from "@/store/cart.store";
import { getAbsoluteImageUrl } from "@/lib/utils";

type GalleryDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default function GalleryDetailsPage({ params }: GalleryDetailsPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { session, isHydrated } = useAuth();
  const { addItem, items: cartItems } = useCartStore();
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // The slug is the photo ID based on our mapping in gallery/page.tsx
  const photoId = slug;

  const { data: photoResponse, isLoading, isError } = usePhotoDetailQuery(photoId);
  const { data: adData } = useAdvertisementQuery();
  const canLoadPrivatePhotoState = isHydrated && Boolean(session);
  const { data: purchasedIdsData } = usePurchasedPhotoIdsQuery({
    enabled: canLoadPrivatePhotoState,
  });

  // Favorites logic
  const { data: favoriteIdsData } = useFavoriteIdsQuery({ enabled: canLoadPrivatePhotoState });
  const toggleMutation = useToggleFavoriteMutation();
  const favoriteIds = favoriteIdsData?.data || [];
  const purchasedIds = purchasedIdsData?.data || [];
  const isFavorited = favoriteIds.includes(photoId);
  const isPurchased = purchasedIds.includes(photoId);

  const handleToggleFavorite = () => {
    if (!isHydrated) return;
    if (!session) {
      toast.error("Please login to add to favourites");
      router.push("/login");
      return;
    }
    toggleMutation.mutate(photoId);
  };

  const handleAddToCart = () => {
    if (!isHydrated) return;
    if (!session) {
      toast.error("Please login to add to cart");
      router.push("/login");
      return;
    }
    if (!photoResponse?.data || isPurchased) return;
    const p = photoResponse.data;
    addItem({
      id: p.id,
      imageUrl: getAbsoluteImageUrl(p.imageUrl),
      title: `Photo by ${p.photographer?.name}`,
      location: p.location?.name || "Unknown Location",
      price: p.price,
    });
  };

  // Fetch related images by same location
  const locationId = photoResponse?.data?.locationId;
  const { data: relatedPhotosResponse } = usePublicPhotosQuery({
    locationId,
    limit: 8,
  });

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-480 py-10 lg:px-8 lg:py-16">
        <div className="flex justify-center p-6">
          <p className="text-sm text-(--color-text-weak)">Loading image details...</p>
        </div>
      </section>
    );
  }

  if (isError || !photoResponse?.data) {
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

  const detailItem = photoResponse.data;

  // Format sizes and dates
  const fileSizeMB = detailItem.fileSize
    ? (detailItem.fileSize / (1024 * 1024)).toFixed(2) + " MB"
    : "N/A";
  const resolution =
    detailItem.width && detailItem.height
      ? `${detailItem.width} x ${detailItem.height} px`
      : "Unknown";
  const format = detailItem.format ? detailItem.format.toUpperCase() : "JPEG";

  const takenDate = new Date(detailItem.capturedAt || detailItem.createdAt);
  const formattedDate = takenDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = takenDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const locationName = detailItem.location?.name || "Unknown Location";
  const photographerName = detailItem.photographer?.name || "Unknown Photographer";

  // Breadcrumb data
  const region = detailItem.location?.region;
  const state = detailItem.location?.state;
  const spot = detailItem.location?.name;

  // Filter out missing parts to join them with pipes
  const breadcrumbParts = [region, state, spot].filter(Boolean);
  const breadcrumbDisplay =
    breadcrumbParts.length > 0 ? breadcrumbParts.join(" | ") : "Location unavailable";

  // Map related photos for RelatedImagesSection
  const relatedImages = (relatedPhotosResponse?.data || [])
    .filter((p: { id: string }) => p.id !== detailItem.id)
    .map(
      (p: {
        id: string;
        imageUrl: string;
        price: number;
        photographer?: { name?: string };
        location?: { name?: string };
      }) => ({
        id: p.id,
        slug: p.id,
        src: getAbsoluteImageUrl(p.imageUrl),
        alt: `Photo by ${p.photographer?.name}`,
        userName: p.photographer?.name || "Unknown",
        location: p.location?.name || "Unknown Location",
        price: `$${p.price.toFixed(2)}`,
      }),
    );

  return (
    <section className="mx-auto max-w-480 py-6 lg:py-10">
      <div className="mx-5 mb-5 flex flex-wrap items-center gap-2 text-sm text-(--color-text-weak) md:mx-12.5">
        <span className="font-medium">{breadcrumbDisplay}</span>
      </div>

      <div className="mx-5 grid gap-9 md:mx-12.5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        {/* Left Side Content (Image and Filmstrip) */}
        <div className="mx-auto w-full max-w-80 sm:max-w-150 md:max-w-2xl lg:max-w-none">
          <div
            className="group relative cursor-zoom-in overflow-hidden rounded-md border border-(--color-line-weaker)"
            style={{ containerType: "inline-size" }}
            onClick={() => setIsFullscreenOpen(true)}
          >
            <Image
              src={getAbsoluteImageUrl(detailItem.imageUrl)}
              alt={`Photo at ${locationName}`}
              width={1800}
              height={1200}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-80 lg:h-205"
              quality={100}
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 70vw, 1200px"
              unoptimized
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              priority
            />

            <div className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-6 w-6" />
            </div>

            <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-black/10" />

            {/* Text Watermark - Using cqw to scale proportionally with image width */}
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden px-[5cqw] select-none">
              <span className="rotate-[-20deg] text-[20cqw] font-black tracking-tight text-white/35 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                surfshare
              </span>
            </div>
          </div>

          {/* Thumbnail Filmstrip */}
          <ThumbnailFilmstrip currentPhotoId={photoId} />
        </div>

        {/* Right Side Content (Details) */}
        <div className="bg-(--color-surface-base)">
          <PageTitle
            subtitlePosition="top"
            subtitle={`Photo by ${photographerName}`}
            subtitleClassName="text-lg! leading-tight text-(--color-text-weak) sm:text-2xl! lg:text-[28px]!"
            title={`$${detailItem.price.toFixed(2)}`}
            titleClassName="text-(--color-text-brand-strong) text-[34px]! leading-none sm:text-[46px]! lg:text-[58px]!"
          />

          <div className="mt-6 space-y-3 text-sm text-(--color-text-weak)">
            <PageTitle
              beforeTitle={<MapPin className="h-5 w-5" color="#0C3173" />}
              subtitle="location"
              subtitlePosition="top"
              title={locationName}
              titleClassName="text-base! text-(--color-text-strong) -mt-4 font-medium!"
              subtitleClassName="text-sm! text-(--color-text-weak)"
            />
            <PageTitle
              beforeTitle={<Calendar className="h-5 w-5" color="#0C3173" />}
              subtitle="Date Taken"
              subtitlePosition="top"
              title={formattedDate}
              titleClassName="text-base! text-(--color-text-strong) -mt-4 font-medium!"
              subtitleClassName="text-sm! text-(--color-text-weak)"
            />
            <PageTitle
              beforeTitle={<Clock3 className="h-5 w-5" color="#0C3173" />}
              subtitle="Time Taken"
              subtitlePosition="top"
              title={formattedTime}
              titleClassName="text-base! text-(--color-text-strong) -mt-4 font-medium!"
              subtitleClassName="text-sm! text-(--color-text-weak)"
            />
            <PageTitle
              beforeTitle={<Camera className="h-5 w-5" color="#0C3173" />}
              subtitle="Photographer"
              subtitlePosition="top"
              title={photographerName}
              titleClassName="text-base! text-(--color-text-strong) -mt-4 font-medium!"
              subtitleClassName="text-sm! text-(--color-text-weak)"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              variant="secondary"
              disabled={toggleMutation.isPending}
              className={
                isFavorited
                  ? "h-10 w-full cursor-pointer border border-(--color-line-brand) bg-(--color-fill-brand-strong) text-white hover:opacity-90"
                  : "h-10 w-full cursor-pointer border border-(--color-line-weaker) bg-(--color-fill-inverse-weak) text-(--color-text-brand-strong) hover:bg-gray-50"
              }
              onClick={handleToggleFavorite}
            >
              {isFavorited ? "Remove from favourites" : "Add to favourites"}
              <Heart className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} />
            </Button>
            <Button
              disabled={isPurchased}
              className={
                isPurchased
                  ? "h-10 w-full cursor-not-allowed bg-green-600 text-white opacity-90 hover:bg-green-600"
                  : "h-10 w-full cursor-pointer bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong) hover:opacity-95"
              }
              onClick={handleAddToCart}
            >
              {isPurchased
                ? "Already Purchased"
                : cartItems.some((item) => item.id === photoId)
                  ? "Added to cart"
                  : "Add to cart"}
              {!isPurchased && <ShoppingCart className="h-4 w-4" />}
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
                  {resolution}
                </dd>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <dt className="text-sm text-(--color-text-weak) sm:text-base">Format</dt>
                <dd className="text-right text-sm font-medium text-(--color-text-strong) sm:text-base">
                  {format}
                </dd>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <dt className="text-sm text-(--color-text-weak) sm:text-base">Size</dt>
                <dd className="text-right text-sm font-medium text-(--color-text-strong) sm:text-base">
                  {fileSizeMB}
                </dd>
              </div>
            </dl>
          </div>

          {/* Advertisement Section */}
          {adData?.data && (
            <Link
              href={adData.data.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-8 block overflow-hidden rounded-md border border-(--color-line-weaker) transition-opacity hover:opacity-95"
            >
              <Image
                src={getAbsoluteImageUrl(adData.data.imageUrl)}
                alt="Advertisement"
                width={960}
                height={412}
                style={{ height: "206px" }}
                className="w-full object-cover"
                quality={100}
                sizes="(max-width: 640px) 100vw, 480px"
                unoptimized
                draggable={false}
                onContextMenu={(event) => event.preventDefault()}
              />
              <div className="absolute top-2 right-2 z-30 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-(--color-text-brand-strong) sm:h-8 sm:w-8">
                <ExternalLink className="h-4 w-4" />
              </div>
            </Link>
          )}
        </div>
      </div>

      {relatedImages.length > 0 && <RelatedImagesSection items={relatedImages} />}

      {/* Fullscreen Viewer */}
      {isFullscreenOpen && (
        <FullscreenImageViewer
          src={getAbsoluteImageUrl(detailItem.imageUrl)}
          alt={`Photo at ${locationName}`}
          width={detailItem.width}
          height={detailItem.height}
          onClose={() => setIsFullscreenOpen(false)}
        />
      )}
    </section>
  );
}
