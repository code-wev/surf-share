"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Clock4,
  Funnel,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
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
export const galleryTimes: string[] = ["all", "first_light", "morning", "lunch", "afternoon"];
export const galleryTimeLabels: Record<string, string> = {
  all: "Any Time",
  first_light: "First Light (4-8 AM)",
  morning: "Morning (8-11 AM)",
  lunch: "Lunch (11 AM-2 PM)",
  afternoon: "Afternoon (2-7 PM)",
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
  const [mobileExpandedState, setMobileExpandedState] = useState<string | null>(null);
  const [mobileExpandedRegion, setMobileExpandedRegion] = useState<string | null>(null);

  const { data: hierarchyResponse } = useQuery({
    queryKey: ["locations-hierarchy"],
    queryFn: async () => {
      const response = await apiClient.get("/locations/hierarchy");
      return response.data;
    },
    enabled: showFilterPanel,
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
            <>
              {/* DESKTOP POPOVER */}
              <div className="absolute top-10 right-0 z-20 hidden items-start gap-1 sm:flex">
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

              {/* MOBILE BOTTOM SHEET DRAWER */}
              <div className="fixed inset-0 z-100 flex flex-col justify-end sm:hidden">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowFilterPanel(false)}
                />
                <div className="animate-in slide-in-from-bottom-full relative flex max-h-[65vh] w-full flex-col rounded-t-2xl bg-white shadow-xl duration-300">
                  <div className="flex items-center justify-between border-b border-(--color-line-weaker) px-6 py-4">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-(--color-text-strong)">
                      <SlidersHorizontal size={18} className="text-[#0C3173]" />
                      Filter & Sort
                    </h2>
                    <button
                      onClick={() => setShowFilterPanel(false)}
                      className="rounded-full p-2 transition-colors hover:bg-(--color-surface-muted-100)"
                    >
                      <X size={20} className="text-(--color-text-weak)" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-8 overflow-y-auto p-6">
                    {/* Sort Section */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 font-semibold text-(--color-text-strong)">
                        <Funnel size={16} className="text-(--color-text-weak)" /> Sort By
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {gallerySorts.map((sort) => (
                          <button
                            key={sort}
                            onClick={() => handleSortSelect(sort)}
                            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                              selectedSort === sort
                                ? "border-(--color-fill-brand-strong) bg-(--color-fill-brand-strong) text-white shadow-md"
                                : "border-(--color-line-weaker) bg-(--color-surface-base) text-(--color-text-strong) hover:bg-(--color-surface-muted-100)"
                            }`}
                          >
                            {gallerySortLabels[sort]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Section */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 font-semibold text-(--color-text-strong)">
                        <Clock4 size={16} className="text-(--color-text-weak)" /> Time of Day
                      </h3>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {galleryTimes.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                              selectedTime === time
                                ? "border-(--color-fill-brand-strong) bg-(--color-fill-brand-strong) text-white shadow-md"
                                : "border-(--color-line-weaker) bg-(--color-surface-base) text-(--color-text-strong) hover:bg-(--color-surface-muted-100)"
                            }`}
                          >
                            {galleryTimeLabels[time]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-4 pb-8">
                      <h3 className="flex items-center gap-2 font-semibold text-(--color-text-strong)">
                        <MapPin size={16} className="text-(--color-text-weak)" /> Location
                      </h3>

                      {!hierarchyData ? (
                        <div className="rounded-xl border border-(--color-line-weaker) p-4 text-center text-sm text-(--color-text-weak)">
                          Loading locations...
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${selectedLocation === "all" || !selectedLocation ? "bg-fill-brand-strong/10 border-(--color-fill-brand-strong) font-bold text-(--color-fill-brand-strong)" : "border-(--color-line-weaker) text-(--color-text-strong)"}`}
                            onClick={() => handleLocationSelect("all")}
                          >
                            All Locations
                          </button>

                          {Object.entries(hierarchyData).map(([state, regions]) => (
                            <div
                              key={state}
                              className="overflow-hidden rounded-xl border border-(--color-line-weaker) bg-white"
                            >
                              <button
                                className="flex w-full items-center justify-between bg-(--color-surface-muted-100) px-4 py-3 text-sm font-bold text-(--color-text-strong)"
                                onClick={() =>
                                  setMobileExpandedState((prev) => (prev === state ? null : state))
                                }
                              >
                                {state}
                                <ChevronRight
                                  size={16}
                                  className={`text-(--color-text-weak) transition-transform ${mobileExpandedState === state ? "rotate-90" : ""}`}
                                />
                              </button>

                              {mobileExpandedState === state && (
                                <div className="space-y-1 bg-white p-2">
                                  <button
                                    className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${selectedLocation === `state:${state}` ? "bg-(--color-fill-brand-strong) text-white" : "text-(--color-text-strong) hover:bg-(--color-surface-muted-100)"}`}
                                    onClick={() => handleLocationSelect(`state:${state}`)}
                                  >
                                    All of {state}
                                  </button>

                                  {Object.entries(regions as Record<string, any[]>).map(
                                    ([region, spots]) => (
                                      <div key={region} className="mt-1">
                                        <button
                                          className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-(--color-text-strong) hover:bg-(--color-surface-muted-100)"
                                          onClick={() =>
                                            setMobileExpandedRegion((prev) =>
                                              prev === region ? null : region,
                                            )
                                          }
                                        >
                                          {region}
                                          {spots.length > 0 && (
                                            <ChevronRight
                                              size={14}
                                              className={`text-(--color-text-weak) transition-transform ${mobileExpandedRegion === region ? "rotate-90" : ""}`}
                                            />
                                          )}
                                        </button>

                                        {mobileExpandedRegion === region && (
                                          <div className="my-1 ml-4 space-y-1 border-l-2 border-(--color-line-weaker) py-1 pr-2 pl-4">
                                            <button
                                              className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${selectedLocation === `region:${region}` ? "bg-(--color-fill-brand-strong) font-medium text-white" : "text-(--color-text-strong) hover:bg-(--color-surface-muted-100)"}`}
                                              onClick={() =>
                                                handleLocationSelect(`region:${region}`)
                                              }
                                            >
                                              All of {region}
                                            </button>
                                            {spots.map((spot) => (
                                              <button
                                                key={spot.id}
                                                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${selectedLocation === spot.id ? "bg-(--color-fill-brand-strong) font-medium text-white" : "text-(--color-text-strong) hover:bg-(--color-surface-muted-100)"}`}
                                                onClick={() => handleLocationSelect(spot.id)}
                                              >
                                                {spot.name}
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
