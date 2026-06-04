"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock4, Funnel, MapPin, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { GallerySort, GalleryTab } from "@/app/(home)/gallery/page";
import LocationFilter from "./location-filter";
import { apiClient } from "@/lib/api/client";

export const galleryTabs: GalleryTab[] = ["all", "today", "yesterday", "last7days", "last14days"];
export const galleryTabLabels: Record<GalleryTab, string> = {
  all: "All",
  today: "Today",
  yesterday: "Yesterday",
  last7days: "Last 7 Days",
  last14days: "Last 14 Days",
};

// Updated time ranges
export const galleryTimes: string[] = [
  "all",
  "5_8",
  "8_11",
  "11_14",
  "14_17",
  "17_20",
  "20_23",
  "23_5",
];
export const galleryTimeLabels: Record<string, string> = {
  all: "Any Time",
  "5_8": "5 AM – 8 AM",
  "8_11": "8 AM – 11 AM",
  "11_14": "11 AM – 2 PM",
  "14_17": "2 PM – 5 PM",
  "17_20": "5 PM – 8 PM",
  "20_23": "8 PM – 11 PM",
  "23_5": "11 PM – 5 AM",
};

export const gallerySorts: GallerySort[] = ["latest", "priceLow", "priceHigh"];
export const gallerySortLabels: Record<GallerySort, string> = {
  latest: "Latest",
  priceLow: "Price Low to High",
  priceHigh: "Price High to Low",
};

type GalleryTitleProps = {
  activeTab: GalleryTab;
  onTabChange: (tab: GalleryTab) => void;
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
  selectedTime: string; // Updated from GalleryTime
  onTimeChange: (time: string) => void;
  selectedSort: GallerySort;
  onSortChange: (sort: GallerySort) => void;
  totalCount: number;
  onResetFilters: () => void;
};

type ActiveSubmenu = "location" | "time" | "sort" | null;

export default function GalleryTitle({
  activeTab,
  onTabChange,
  selectedLocation,
  onLocationChange,
  selectedTime,
  onTimeChange,
  selectedSort,
  onSortChange,
  totalCount,
  onResetFilters,
}: GalleryTitleProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<ActiveSubmenu>(null);

  const { data: hierarchyResponse } = useQuery({
    queryKey: ["locations-hierarchy"],
    queryFn: async () => {
      const response = await apiClient.get("/locations/hierarchy");
      return response.data;
    },
    enabled: showFilterPanel && activeSubmenu === "location",
  });

  const hierarchyData = hierarchyResponse?.data;

  const imagesLabel = useMemo(() => `${totalCount} Images`, [totalCount]);

  const handleFilterRowClick = (menu: ActiveSubmenu) => {
    setActiveSubmenu((prev) => (prev === menu ? null : menu));
  };

  const handleLocationSelect = (locationId: string) => {
    onLocationChange(locationId);
    setActiveSubmenu(null);
    setShowFilterPanel(false);
  };

  const handleTimeSelect = (value: string) => {
    onTimeChange(value);
    setActiveSubmenu(null);
    setShowFilterPanel(false);
  };

  const handleSortSelect = (value: GallerySort) => {
    onSortChange(value);
    setActiveSubmenu(null);
    setShowFilterPanel(false);
  };

  return (
    <section className="bg-(--color-surface-muted-100) px-4 pt-10 pb-6 sm:px-6 md:mx-12.5 md:px-6 md:pt-16">
      <div className="mx-auto flex max-w-480 flex-col items-center justify-between gap-6 lg:flex-row lg:items-start">
        <div>
          <PageTitle
            subtitle="Explore our gallery"
            subtitleClassName="mt-1 text-[22px]! text-(--color-text-weak)!"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:flex-row">
          {galleryTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={
                activeTab === tab
                  ? "cursor-pointer rounded-md border border-(--color-line-brand) bg-(--color-fill-brand-strong) px-4 py-1.5 text-sm font-medium text-(--color-text-inverse-strong)"
                  : "cursor-pointer rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) px-4 py-1.5 text-sm text-(--color-text-weak) hover:bg-[#F5F5F4]"
              }
            >
              {galleryTabLabels[tab]}
            </button>
          ))}
        </div>

        <div className="relative flex w-full items-center justify-center gap-3 sm:w-auto lg:justify-end">
          <p className="text-sm text-(--color-text-weak)">{imagesLabel}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
            className="border border-(--color-line-weaker) bg-(--color-surface-base) text-(--color-text-weak) hover:bg-[#F5F5F4]"
          >
            <RotateCcw size={14} />
            <span className="hidden md:flex">Reset</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={
              showFilterPanel
                ? "border border-(--color-line-weaker) bg-white text-(--color-text-brand-strong)"
                : "border border-(--color-line-weaker) bg-(--color-surface-base) text-(--color-text-brand-strong)"
            }
            onClick={() => {
              setShowFilterPanel((prev) => !prev);
              setActiveSubmenu(null);
            }}
          >
            Filter &amp; Sort
            <SlidersHorizontal size={16} className="text-(--color-text-weak)" color="#0C3173" />
          </Button>

          {showFilterPanel ? (
            <div className="absolute top-10 right-0 z-20 flex items-start gap-1">
              {/* Location submenu — shown to the LEFT of the main panel */}
              {activeSubmenu === "location" && hierarchyData && (
                <LocationFilter
                  hierarchy={hierarchyData}
                  onSelect={handleLocationSelect}
                  selectedId={selectedLocation}
                />
              )}
              {activeSubmenu === "location" && !hierarchyData && (
                <div className="w-48 overflow-hidden rounded-md border border-(--color-line-weaker) bg-white shadow-lg">
                  <p className="px-4 py-3 text-sm text-(--color-text-weak)">Loading…</p>
                </div>
              )}

              {/* Time submenu — shown to the LEFT of the main panel */}
              {activeSubmenu === "time" && (
                <div className="w-44 overflow-hidden rounded-md border border-(--color-line-weaker) bg-white shadow-lg">
                  {galleryTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-(--color-surface-muted-100) ${
                        selectedTime === time
                          ? "font-medium text-(--color-text-strong)"
                          : "text-(--color-text-weak)"
                      }`}
                    >
                      {galleryTimeLabels[time]}
                    </button>
                  ))}
                </div>
              )}

              {/* Sort submenu — shown to the LEFT of the main panel */}
              {activeSubmenu === "sort" && (
                <div className="w-44 overflow-hidden rounded-md border border-(--color-line-weaker) bg-white shadow-lg">
                  {gallerySorts.map((sort) => (
                    <button
                      key={sort}
                      type="button"
                      onClick={() => handleSortSelect(sort)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-(--color-surface-muted-100) ${
                        selectedSort === sort
                          ? "font-medium text-(--color-text-strong)"
                          : "text-(--color-text-weak)"
                      }`}
                    >
                      {gallerySortLabels[sort]}
                    </button>
                  ))}
                </div>
              )}

              {/* Main filter panel — always visible while showFilterPanel is true */}
              <div className="w-56 overflow-hidden rounded-md border border-(--color-line-weaker) bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-(--color-line-weaker) px-4 py-3">
                  <span className="text-sm font-medium text-(--color-text-brand-strong)">
                    Filter &amp; Sort
                  </span>
                  <SlidersHorizontal
                    size={16}
                    className="text-(--color-text-weak)"
                    color="#0C3173"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleFilterRowClick("location")}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-(--color-surface-muted-100) ${
                    activeSubmenu === "location" ? "bg-(--color-surface-muted-100)" : ""
                  }`}
                >
                  <MapPin size={16} />
                  <span className="flex-1 text-left text-(--color-text-strong)">Location</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleFilterRowClick("time")}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-(--color-surface-muted-100) ${
                    activeSubmenu === "time" ? "bg-(--color-surface-muted-100)" : ""
                  }`}
                >
                  <Clock4 size={16} />
                  <span className="flex-1 text-left text-(--color-text-strong)">Time</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleFilterRowClick("sort")}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-(--color-surface-muted-100) ${
                    activeSubmenu === "sort" ? "bg-(--color-surface-muted-100)" : ""
                  }`}
                >
                  <Funnel size={16} />
                  <span className="flex-1 text-left text-(--color-text-strong)">Sort</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
