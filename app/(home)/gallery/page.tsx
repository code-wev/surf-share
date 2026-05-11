"use client";

import { useState } from "react";

import GalleryContent from "@/components/home/gallery/gallery-content";
import GalleryPagination from "@/components/home/gallery/gallery-pagination";
import GalleryTitle from "@/components/home/gallery/gallery-title";
import { usePublicPhotosQuery } from "@/hooks/api/usePhotos";
import { useLocationsQuery } from "@/hooks/api/useLocations";

export type GalleryTab = "all" | "today" | "yesterday" | "last7days" | "last14days";
export type GalleryTime = "all" | "FIRST_LIGHT" | "MORNING" | "LUNCH" | "AFTERNOON";
export type GallerySort = "latest" | "priceLow" | "priceHigh";

const PAGE_SIZE = 16;

type ApiPhoto = {
  id: string;
  imageUrl: string;
  price: number;
  photographer?: { name?: string };
  location?: { name?: string };
};

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedTime, setSelectedTime] = useState<GalleryTime>("all");
  const [selectedSort, setSelectedSort] = useState<GallerySort>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: locationsData } = useLocationsQuery({ page: 1, limit: 100 });
  const liveLocations = locationsData?.data || [];

  const handleTabChange = (tab: GalleryTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    setCurrentPage(1);
  };

  const handleTimeChange = (time: GalleryTime) => {
    setSelectedTime(time);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: GallerySort) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const { data: photosData, isLoading } = usePublicPhotosQuery({
    tab: activeTab,
    locationId: selectedLocation,
    timeKey: selectedTime,
    sort: selectedSort,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const photos = photosData?.data || [];
  const meta = photosData?.meta || { total: 0, totalPages: 1 };

  // Map backend photos to GallerySeedImage format for CardView
  const mappedPhotos = photos.map((p: ApiPhoto) => ({
    id: p.id,
    slug: p.id,
    src: p.imageUrl,
    alt: `Photo by ${p.photographer?.name}`,
    userName: p.photographer?.name || "Unknown",
    location: p.location?.name || "Unknown Location",
    price: `$${p.price.toFixed(2)}`,
    avatarSrc: "/home/logo.png",
  }));

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
        liveLocations={liveLocations}
      />
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-500">Loading photos...</p>
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
