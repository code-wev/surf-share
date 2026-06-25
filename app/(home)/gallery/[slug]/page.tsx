"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
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
import { IPhotoResponse } from "@/lib/api/services/photo.service";
import { queryKeys } from "@/lib/api/query-keys";

type GalleryDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default function GalleryDetailsPage({ params }: GalleryDetailsPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session, isHydrated } = useAuth();
  const { addItem, items: cartItems } = useCartStore();

  // Internal state for the current photo ID to enable smooth navigation without remounting
  const [currentPhotoId, setCurrentPhotoId] = useState(slug);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Sync state with URL changes (e.g., browser back/forward)
  useEffect(() => {
    setCurrentPhotoId(slug);
  }, [slug]);

  // Try to get data from cache first for instant navigation
  const cachedData = queryClient.getQueryData<{ data: IPhotoResponse }>(
    queryKeys.photos.detail(currentPhotoId),
  );

  // Only enable the query if we do not have the data in cache
  const {
    data: photoResponse,
    isLoading: isQueryLoading,
    isError,
  } = usePhotoDetailQuery(currentPhotoId, {
    enabled: !cachedData,
  });

  // Use cached data if available, otherwise use query response
  const photoData = cachedData || photoResponse;

  // Show loading ONLY if we don't have any data and the query is still loading
  const isLoading = !photoData && isQueryLoading;

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
  const isFavorited = favoriteIds.includes(currentPhotoId);
  const isPurchased = purchasedIds.includes(currentPhotoId);

  const handleToggleFavorite = () => {
    if (!isHydrated) return;
    if (!session) {
      toast.error("Please login to add to favourites");
      router.push("/login");
      return;
    }
    toggleMutation.mutate(currentPhotoId);
  };

  const handleAddToCart = () => {
    if (!isHydrated) return;
    if (!session) {
      toast.error("Please login to add to cart");
      router.push("/login");
      return;
    }
    if (!photoData?.data || isPurchased) return;
    const p = photoData.data;
    addItem({
      id: p.id,
      imageUrl: getAbsoluteImageUrl(p.imageUrl),
      title: `Photo by ${p.photographer?.name}`,
      location: p.location?.name || "Unknown Location",
      price: p.price,
    });
  };

  // Fetch related images by same location
  const locationId = photoData?.data?.locationId;
  const { data: relatedPhotosResponse } = usePublicPhotosQuery({
    locationId: locationId || "loading",
    limit: 8,
  });

  // Fetch all photos for navigation
  const { data: allPhotosResponse } = usePublicPhotosQuery({
    locationId: locationId || "loading",
    limit: 100,
  });

  const allPhotos = (allPhotosResponse?.data || []) as IPhotoResponse[];
  const currentIndex = allPhotos.findIndex((p) => p.id === currentPhotoId);

  // Circular navigation logic
  const prevIndex =
    allPhotos.length > 0 ? (currentIndex - 1 + allPhotos.length) % allPhotos.length : -1;
  const nextIndex = allPhotos.length > 0 ? (currentIndex + 1) % allPhotos.length : -1;

  const prevPhoto = prevIndex !== -1 ? allPhotos[prevIndex] : null;
  const nextPhoto = nextIndex !== -1 ? allPhotos[nextIndex] : null;

  const navigateTo = (id: string) => {
    // Before navigating, pre-populate cache for the target photo if it exists in allPhotos
    const targetPhoto = allPhotos.find((p) => p.id === id);
    if (targetPhoto) {
      queryClient.setQueryData(queryKeys.photos.detail(id), { data: targetPhoto });
    }
    // Update internal state for instant UI update without remounting
    setCurrentPhotoId(id);
    // Update URL silently
    window.history.pushState(null, "", `/gallery/${id}`);
  };

  const handleBackToGallery = () => {
    if (locationId) {
      router.push(`/gallery?locationId=${locationId}`, { scroll: false });
    } else {
      router.push("/gallery", { scroll: false });
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-480 py-10 lg:px-8 lg:py-16">
        <div className="flex min-h-100 justify-center p-6">
          <p className="text-sm text-(--color-text-weak)">Loading image details...</p>
        </div>
      </section>
    );
  }

  if (isError || !photoData?.data) {
    return (
      <section className="mx-auto w-full max-w-400 py-10 lg:px-8 lg:py-16">
        <div className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-6">
          <p className="text-sm text-(--color-text-weak)">Image not found.</p>
          <button
            onClick={handleBackToGallery}
            className="mt-2 inline-block cursor-pointer text-sm font-medium text-(--color-text-brand-strong)"
          >
            Back to gallery
          </button>
        </div>
      </section>
    );
  }

  const detailItem = photoData.data;

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

  const navigateToFilteredGallery = (filterValue: string) => {
    router.push(`/gallery?locationId=${encodeURIComponent(filterValue)}`, { scroll: false });
  };

  const breadcrumbDisplay = (
    <div className="flex flex-wrap items-center gap-1">
      {state && (
        <>
          <button
            onClick={() => navigateToFilteredGallery(`state:${state}`)}
            className="cursor-pointer font-medium text-(--color-text-weak) hover:underline"
          >
            {state}
          </button>
          {(region || spot) && <span className="text-(--color-text-weaker) mx-1">|</span>}
        </>
      )}
      {region && (
        <>
          <button
            onClick={() => navigateToFilteredGallery(`region:${region}`)}
            className="cursor-pointer font-medium text-(--color-text-weak) hover:underline"
          >
            {region}
          </button>
          {spot && <span className="text-(--color-text-weaker) mx-1">|</span>}
        </>
      )}
      {spot && (
        <button
          onClick={() => navigateToFilteredGallery(locationId)}
          className="cursor-pointer font-medium text-(--color-text-weak) hover:underline"
        >
          {spot}
        </button>
      )}
      {!state && !region && !spot && (
        <span className="font-medium">Location unavailable</span>
      )}
    </div>
  );

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

            {/* Navigation Arrows */}
            {prevPhoto && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(prevPhoto.id);
                }}
                className="absolute top-1/2 left-4 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}
            {nextPhoto && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(nextPhoto.id);
                }}
                className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}

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
          <ThumbnailFilmstrip
            currentPhotoId={currentPhotoId}
            onNavigate={navigateTo}
            photos={allPhotos}
          />
        </div>

        {/* Right Side Content (Details) */}
        <div className="w-full min-w-0 overflow-hidden bg-(--color-surface-base)">
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
            {!(
              session?.role === "PHOTOGRAPHER" ||
              session?.role === "MODERATOR" ||
              session?.role === "ADMIN"
            ) && (
              <>
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
                    : cartItems.some((item) => item.id === currentPhotoId)
                      ? "Added to cart"
                      : "Add to cart"}
                  {!isPurchased && <ShoppingCart className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>

          <div className="mt-6 border-t border-(--color-line-weaker) pt-5">
            <h2 className="text-2xl font-semibold text-(--color-text-strong) sm:text-[28px]">
              Image Specifications
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <dt className="text-sm text-(--color-text-weak) shrink-0 sm:text-base">Resolution</dt>
                <dd className="text-right text-sm font-medium text-(--color-text-strong) wrap-break-word sm:text-base">
                  {resolution}
                </dd>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <dt className="text-sm text-(--color-text-weak) shrink-0 sm:text-base">Format</dt>
                <dd className="text-right text-sm font-medium text-(--color-text-strong) wrap-break-word sm:text-base">
                  {format}
                </dd>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <dt className="text-sm text-(--color-text-weak) shrink-0 sm:text-base">Size</dt>
                <dd className="text-right text-sm font-medium text-(--color-text-strong) wrap-break-word sm:text-base">
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
                className="h-auto w-full max-w-full object-cover sm:h-51.5"
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

      {relatedImages.length > 0 && (
        <RelatedImagesSection items={relatedImages} onNavigate={navigateTo} />
      )}

      {/* Fullscreen Viewer */}
      {isFullscreenOpen && (
        <FullscreenImageViewer
          initialPhoto={detailItem}
          allPhotos={allPhotos}
          onClose={() => setIsFullscreenOpen(false)}
          onPhotoChange={navigateTo}
        />
      )}
    </section>
  );
}
