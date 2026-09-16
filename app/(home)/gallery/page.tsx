"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

import GalleryContent from "@/components/home/gallery/gallery-content";
import GalleryTitle from "@/components/home/gallery/gallery-title";
import { usePublicPhotosInfiniteQuery } from "@/hooks/api/usePhotos";
import { queryKeys } from "@/lib/api/query-keys";
import { photoService } from "@/lib/api/services/photo.service";
import { getAbsoluteImageUrl } from "@/lib/utils";

export type GalleryTab = "all" | "today" | "yesterday" | "last7days" | "last14days";
export type GallerySort = "latest" | "priceLow" | "priceHigh";

const BATCH_SIZE = 32;

type ApiPhoto = {
  id: string;
  title?: string | null;
  imageUrl: string;
  price: number;
  capturedAt?: string | null;
  createdAt: string;
  photographer?: { name?: string };
  location?: { name?: string };
};

function GalleryPageContent() {
  const searchParams = useSearchParams();
  const locationQuery = searchParams.get("locationId");
  const queryClient = useQueryClient();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<GalleryTab>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>(locationQuery || "all");
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<GallerySort>("latest");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Infinite Query with batch size 32
  const {
    data: photosData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePublicPhotosInfiniteQuery(
    {
      tab: activeTab,
      locationId: selectedLocation === "all" ? undefined : selectedLocation,
      timeKey: selectedTime === "all" ? undefined : selectedTime,
      sort: selectedSort,
    },
    BATCH_SIZE,
  );

  // IntersectionObserver for infinite scrolling sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Track window scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pre-fetch details for newly loaded batch of photos
  useEffect(() => {
    if (!photosData?.pages?.length) return;
    const lastPage = photosData.pages[photosData.pages.length - 1];
    if (lastPage?.data) {
      lastPage.data.forEach((photo: ApiPhoto) => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.photos.detail(photo.id),
          queryFn: () => photoService.getById(photo.id),
          staleTime: 5 * 60 * 1000,
        });
      });
    }
  }, [photosData?.pages, queryClient]);

  const handleTabChange = (tab: GalleryTab) => {
    setActiveTab(tab);
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleSortChange = (sort: GallerySort) => {
    setSelectedSort(sort);
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSelectedLocation("all");
    setSelectedTime("all");
    setSelectedSort("latest");
  };

  const allPhotos: ApiPhoto[] =
    photosData?.pages?.flatMap((page) => page.data || []) || [];
  const totalCount = photosData?.pages?.[0]?.meta?.total ?? 0;

  const mappedPhotos = allPhotos.map((p: ApiPhoto) => {
    const dateToUse = new Date(p.capturedAt || p.createdAt);
    const formattedDate = dateToUse.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      id: p.id,
      slug: p.id,
      src: getAbsoluteImageUrl(p.imageUrl),
      alt: p.title || `Photo by ${p.photographer?.name}`,
      userName: p.photographer?.name || "Unknown",
      location: p.location?.name || "Unknown Location",
      price: `$${p.price.toFixed(2)}`,
      avatarSrc: "/home/logo.png",
      title: p.title || `Photo by ${p.photographer?.name}`,
      captureDate: formattedDate,
    };
  });

  return (
    <>
      <GalleryTitle
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        selectedTime={selectedTime}
        onTimeChange={handleTimeChange}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        totalCount={totalCount}
        onResetFilters={handleResetFilters}
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="text-brand-default h-8 w-8 animate-spin" />
        </div>
      ) : mappedPhotos.length > 0 ? (
        <>
          <GalleryContent items={mappedPhotos} />

          {/* Sentinel for triggering next page load */}
          <div ref={sentinelRef} className="h-6 w-full" />

          {/* Bottom loader while fetching next batch */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-line-weaker bg-surface-muted-100 px-4 py-2 text-sm font-medium text-text-weak shadow-xs">
                <Loader2 className="text-brand-default h-4 w-4 animate-spin" />
                <span>Loading more photos...</span>
              </div>
            </div>
          )}

          {/* End of Gallery badge */}
          {!hasNextPage && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-line-weaker mb-4 h-px w-24" />
              <p className="text-text-weak text-sm font-medium">
                You&apos;ve reached the end of the gallery ({totalCount}{" "}
                {totalCount === 1 ? "photo" : "photos"})
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-text-strong text-lg font-medium">No photos found</p>
          <p className="text-text-weak mt-1 text-sm">
            Try adjusting your filters or date range.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover mt-4 inline-flex h-9 items-center rounded-sm px-4 text-sm font-medium transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Floating Back to Top button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover fixed right-6 bottom-6 z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
          title="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="text-brand-default h-10 w-10 animate-spin" />
        </div>
      }
    >
      <GalleryPageContent />
    </Suspense>
  );
}
