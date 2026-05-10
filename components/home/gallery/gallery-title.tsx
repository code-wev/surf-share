"use client";

import { useMemo, useState } from "react";

import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock4, Funnel, MapPin, SlidersHorizontal } from "lucide-react";
import type { GallerySort, GalleryTab, GalleryTime } from "@/app/(home)/gallery/page";

export const galleryTabs: GalleryTab[] = ["all", "today", "yesterday", "last7days", "last14days"];
export const galleryTabLabels: Record<GalleryTab, string> = {
  all: "All",
  today: "Today",
  yesterday: "Yesterday",
  last7days: "Last 7 Days",
  last14days: "Last 14 Days",
};

export const galleryTimes: GalleryTime[] = ["all", "FIRST_LIGHT", "MORNING", "LUNCH", "AFTERNOON"];
export const galleryTimeLabels: Record<GalleryTime, string> = {
  all: "Any Time",
  FIRST_LIGHT: "First Light (4-8 AM)",
  MORNING: "Morning (8-11 AM)",
  LUNCH: "Lunch (11 AM-2 PM)",
  AFTERNOON: "Afternoon (2-7 PM)",
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
  selectedTime: GalleryTime;
  onTimeChange: (time: GalleryTime) => void;
  selectedSort: GallerySort;
  onSortChange: (sort: GallerySort) => void;
  totalCount: number;
  liveLocations: any[];
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
  liveLocations,
}: GalleryTitleProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<ActiveSubmenu>(null);

  const imagesLabel = useMemo(() => `${totalCount} Images`, [totalCount]);

  const handleFilterRowClick = (menu: ActiveSubmenu) => {
    setActiveSubmenu((prev) => (prev === menu ? null : menu));
  };

  const handleLocationSelect = (value: string) => {
    onLocationChange(value);
    setActiveSubmenu(null);
    setShowFilterPanel(false);
  };

  const handleTimeSelect = (value: GalleryTime) => {
    onTimeChange(value);
    setActiveSubmenu(null);
    setShowFilterPanel(false);
  };

  const handleSortSelect = (value: GallerySort) => {
    onSortChange(value);
    setActiveSubmenu(null);
    setShowFilterPanel(false);
  };

  const selectedLocationName = selectedLocation === "all" 
    ? "All Locations" 
    : liveLocations.find(l => l.id === selectedLocation)?.name || "Unknown Location";

  return (
    <section className="bg-(--color-surface-muted-100) px-4 pt-10 pb-6 sm:px-6 md:mx-12.5 md:px-6 md:pt-16">
      <div className="mx-auto flex max-w-480 flex-col items-center justify-between gap-6 lg:flex-row lg:items-start">
        <div>
          <PageTitle
            subtitle={`${selectedLocationName} Photos`}
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
            <div className="absolute top-16 right-0 z-20 flex w-[92vw] max-w-105 flex-col gap-2 sm:w-105 md:top-16 md:w-auto md:max-w-none md:flex-row md:items-start md:gap-0">
              {/* Location submenu */}
              {activeSubmenu === "location" && (
                <div className="w-full overflow-hidden rounded-md border border-(--color-line-weaker) bg-white shadow-lg md:mt-6 md:mr-1 md:w-52">
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold tracking-wide text-(--color-text-weak) uppercase">
                    Regions
                  </p>
                  <button
                    type="button"
                    onClick={() => handleLocationSelect("all")}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-(--color-surface-muted-100) ${
                      selectedLocation === "all"
                        ? "font-medium text-(--color-text-strong)"
                        : "text-(--color-text-weak)"
                    }`}
                  >
                    All States
                  </button>
                  {liveLocations.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => handleLocationSelect(location.id)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-(--color-surface-muted-100) ${
                        selectedLocation === location.id
                          ? "font-medium text-(--color-text-strong)"
                          : "text-(--color-text-weak)"
                      }`}
                    >
                      {location.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Time submenu */}
              {activeSubmenu === "time" && (
                <div className="w-full overflow-hidden rounded-md border border-(--color-line-weaker) bg-white shadow-lg md:mt-6 md:mr-1 md:w-44">
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

              {/* Sort submenu */}
              {activeSubmenu === "sort" && (
                <div className="w-full overflow-hidden rounded-md border border-(--color-line-weaker) bg-white shadow-lg md:mt-6 md:mr-1 md:w-44">
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

              {/* Main filter panel */}
              <div className="w-full overflow-hidden rounded-md border border-(--color-line-weaker) bg-white shadow-lg md:w-56">
                <div className="flex items-center justify-between border-b border-(--color-line-weaker) px-4 py-3">
                  <span className="text-sm font-medium text-(--color-text-brand-strong)">
                    Filter &amp; Sort
                  </span>
                  <SlidersHorizontal size={16} className="text-(--color-text-weak)" color="#0C3173" />
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
