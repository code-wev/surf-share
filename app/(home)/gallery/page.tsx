"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import GalleryContent from "@/components/home/gallery/gallery-content";
import GalleryPagination from "@/components/home/gallery/gallery-pagination";
import GalleryTitle from "@/components/home/gallery/gallery-title";
import { usePublicPhotosQuery } from "@/hooks/api/usePhotos";
import { Loader2 } from "lucide-react";
import { getAbsoluteImageUrl, formatFileSize } from "@/lib/utils";
import { queryKeys } from "@/lib/api/query-keys";
import { photoService } from "@/lib/api/services/photo.service";

export type GalleryTab = "all" | "today" | "yesterday" | "last7days" | "last14days";
export type GallerySort = "latest" | "priceLow" | "priceHigh";

const PAGE_SIZE = 16;

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

  const [activeTab, setActiveTab] = useState<GalleryTab>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>(locationQuery || "all");
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<GallerySort>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: photosData, isLoading } = usePublicPhotosQuery({
    tab: activeTab,
    locationId: selectedLocation === "all" ? undefined : selectedLocation,
    timeKey: selectedTime === "all" ? undefined : selectedTime,
    sort: selectedSort,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  // Pre-fetch details for all photos on the current page when data arrives
  useEffect(() => {
    if (photosData?.data) {
      photosData.data.forEach((photo: ApiPhoto) => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.photos.detail(photo.id),
          queryFn: () => photoService.getById(photo.id),
          staleTime: 5 * 60 * 1000,
        });
      });
    }
  }, [photosData, queryClient]);

  const handleTabChange = (tab: GalleryTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    setCurrentPage(1);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: GallerySort) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSelectedLocation("all");
    setSelectedTime("all");
    setSelectedSort("latest");
    setCurrentPage(1);
  };

  const photos = photosData?.data || [];
  const meta = photosData?.meta || { total: 0, totalPages: 1 };
  const mappedPhotos = photos.map((p: ApiPhoto) => {
    const dateToUse = new Date(p.capturedAt || p.createdAt);
    const formattedDate = dateToUse.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
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
        totalCount={meta.total}
        onResetFilters={handleResetFilters}
      />
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-default" />
        </div>
      ) : (
        <GalleryContent items={mappedPhotos} />
      )}
      <GalleryPagination
        currentPage={currentPage}
        totalPages={meta.totalPages}
        onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), meta.totalPages))}
      />
    </>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-default" />
        </div>
      }
    >
      <GalleryPageContent />
    </Suspense>
  );
}
