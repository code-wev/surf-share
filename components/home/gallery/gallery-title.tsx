"use client";

import { useMemo, useState } from "react";

import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import type {
  GalleryLocation,
  GallerySort,
  GalleryTab,
  GalleryTime,
} from "@/components/home/gallery/gallery-images";
import {
  galleryLocations,
  galleryLocationLabels,
  gallerySortLabels,
  gallerySorts,
  galleryTabLabels,
  galleryTabs,
  galleryTimeLabels,
  galleryTimes,
} from "@/components/home/gallery/gallery-images";
import { ChevronRight, Clock4, Funnel, MapPin, SlidersHorizontal } from "lucide-react";

type GalleryTitleProps = {
  activeTab: GalleryTab;
  onTabChange: (tab: GalleryTab) => void;
  selectedLocation: GalleryLocation;
  onLocationChange: (location: GalleryLocation) => void;
  selectedTime: GalleryTime;
  onTimeChange: (time: GalleryTime) => void;
  selectedSort: GallerySort;
  onSortChange: (sort: GallerySort) => void;
  totalCount: number;
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
}: GalleryTitleProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<ActiveSubmenu>(null);

  const imagesLabel = useMemo(() => `${totalCount} Images`, [totalCount]);

  const handleFilterRowClick = (menu: ActiveSubmenu) => {
    setActiveSubmenu((prev) => (prev === menu ? null : menu));
  };

  const handleLocationSelect = (value: GalleryLocation) => {
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

  return (
    <section className="bg-(--color-surface-muted-100) px-4 pt-10 pb-6 sm:px-6 md:mx-12.5 md:px-6 md:pt-16">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-start">
        <div>
          <PageTitle
            subtitle="Trigg Beach, WA Photos"
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
            {/* Sliders icon */}
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
                  {galleryLocations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleLocationSelect(location)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-(--color-surface-muted-100) ${
                        selectedLocation === location
                          ? "font-medium text-(--color-text-strong)"
                          : "text-(--color-text-weak)"
                      }`}
                    >
                      {galleryLocationLabels[location]}
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
                {/* Panel header */}
                <div className="flex items-center justify-between border-b border-(--color-line-weaker) px-4 py-3">
                  <span className="text-sm font-medium text-(--color-text-brand-strong)">
                    Filter &amp; Sort
                  </span>
                  {/* Sliders icon */}
                  <SlidersHorizontal
                    size={16}
                    className="text-(--color-text-weak)"
                    color="#0C3173"
                  />
                </div>

                {/* Location row */}
                <button
                  type="button"
                  onClick={() => handleFilterRowClick("location")}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-(--color-surface-muted-100) ${
                    activeSubmenu === "location" ? "bg-(--color-surface-muted-100)" : ""
                  }`}
                >
                  {/* Location pin icon */}
                  <MapPin size={16} />
                  <span className="flex-1 text-left text-(--color-text-strong)">Location</span>
                  {/* Chevron right */}
                  <ChevronRight size={16} />
                </button>

                {/* Time row */}
                <button
                  type="button"
                  onClick={() => handleFilterRowClick("time")}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-(--color-surface-muted-100) ${
                    activeSubmenu === "time" ? "bg-(--color-surface-muted-100)" : ""
                  }`}
                >
                  {/* Clock icon */}
                  <Clock4 size={16} />
                  <span className="flex-1 text-left text-(--color-text-strong)">Time</span>
                  <ChevronRight size={16} />
                </button>

                {/* Sort row */}
                <button
                  type="button"
                  onClick={() => handleFilterRowClick("sort")}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-(--color-surface-muted-100) ${
                    activeSubmenu === "sort" ? "bg-(--color-surface-muted-100)" : ""
                  }`}
                >
                  {/* Sort/filter icon */}
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
