"use client";

import { useMemo, useState } from "react";

import GalleryContent from "@/components/home/gallery/gallery-content";
import {
  gallerySeedImages,
  type GalleryLocation,
  type GallerySort,
  type GalleryTab,
  type GalleryTime,
} from "@/components/home/gallery/gallery-images";
import GalleryPagination from "@/components/home/gallery/gallery-pagination";
import GalleryTitle from "@/components/home/gallery/gallery-title";

const PAGE_SIZE = 16;

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("all");
  const [selectedLocation, setSelectedLocation] = useState<GalleryLocation>("all");
  const [selectedTime, setSelectedTime] = useState<GalleryTime>("all");
  const [selectedSort, setSelectedSort] = useState<GallerySort>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (tab: GalleryTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleLocationChange = (location: GalleryLocation) => {
    setSelectedLocation(location);
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

  const filteredAndSortedImages = useMemo(() => {
    const filtered = gallerySeedImages.filter((image) => {
      const matchesTab = activeTab === "all" || image.tab === activeTab;
      const matchesLocation = selectedLocation === "all" || image.locationKey === selectedLocation;
      const matchesTime = selectedTime === "all" || image.timeKey === selectedTime;

      return matchesTab && matchesLocation && matchesTime;
    });

    // Keep backend/data order by default so cards render in the same sequence as input.
    const sorted = [...filtered];

    if (selectedSort === "priceLow") {
      sorted.sort((firstImage, secondImage) => firstImage.priceValue - secondImage.priceValue);
    }

    if (selectedSort === "priceHigh") {
      sorted.sort((firstImage, secondImage) => secondImage.priceValue - firstImage.priceValue);
    }

    return sorted;
  }, [activeTab, selectedLocation, selectedSort, selectedTime]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedImages.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedImages = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredAndSortedImages.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedImages, safeCurrentPage]);

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
        totalCount={filteredAndSortedImages.length}
      />
      <GalleryContent items={pagedImages} />
      <GalleryPagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
      />
    </>
  );
}
