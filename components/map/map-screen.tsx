"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useMapLocationsQuery } from "@/hooks/api/useLocations";
import { Loader2, Filter, X, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  // timeOptions,
  type SurfSpot,
  // type TimeOptionValue,
} from "@/components/map/map-demo-data";
import { getAbsoluteImageUrl } from "@/lib/utils";

const SurfMapView = dynamic(() => import("@/components/map/surf-map-view"), {
  ssr: false,
  loading: () => (
    <div className="bg-fill-weak text-text-weak flex h-full w-full items-center justify-center text-sm">
      Loading map...
    </div>
  ),
});

export default function MapScreen() {
  const { data: mapDataResponse, isLoading } = useMapLocationsQuery();

  const liveSurfSpots = useMemo(() => {
    const spots = (mapDataResponse?.data || []) as SurfSpot[];
    return spots.map((spot) => ({
      ...spot,
      imageSrc: getAbsoluteImageUrl(spot.imageSrc),
    }));
  }, [mapDataResponse?.data]);

  const [selectedState, setSelectedState] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  // const [selectedTime, setSelectedTime] = useState<TimeOptionValue>("all");
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const stateOptions = useMemo(() => {
    return ["all", ...Array.from(new Set(liveSurfSpots.map((spot) => spot.state)))];
  }, [liveSurfSpots]);

  const regionOptions = useMemo(() => {
    const spots =
      selectedState === "all"
        ? liveSurfSpots
        : liveSurfSpots.filter((spot) => spot.state === selectedState);

    return ["all", ...Array.from(new Set(spots.map((spot) => spot.region)))];
  }, [selectedState, liveSurfSpots]);

  const filteredSpots = useMemo(() => {
    return liveSurfSpots.filter((spot) => {
      const matchesState = selectedState === "all" || spot.state === selectedState;
      const matchesRegion = selectedRegion === "all" || spot.region === selectedRegion;
      // const matchesTime = selectedTime === "all" || spot.timeWindows.includes(selectedTime);

      let inDateRange = true;
      if (selectedFromDate && spot.availableTo) {
        if (selectedFromDate > spot.availableTo) inDateRange = false;
      }
      if (selectedToDate && spot.availableFrom) {
        if (selectedToDate < spot.availableFrom) inDateRange = false;
      }

      // return matchesState && matchesRegion && matchesTime && inDateRange;
      return matchesState && matchesRegion && inDateRange;
    });
    // }, [liveSurfSpots, selectedRegion, selectedState, selectedTime, selectedFromDate, selectedToDate]);
  }, [liveSurfSpots, selectedRegion, selectedState, selectedFromDate, selectedToDate]);

  const resolvedActiveSpotId = filteredSpots.some((spot) => spot.id === activeSpotId)
    ? activeSpotId
    : (filteredSpots[0]?.id ?? null);

  const activeSpot: SurfSpot | null = useMemo(() => {
    if (!filteredSpots.length) return null;
    return filteredSpots.find((spot) => spot.id === resolvedActiveSpotId) ?? filteredSpots[0];
  }, [filteredSpots, resolvedActiveSpotId]);

  if (isLoading) {
    return (
      <section className="font-sf-pro absolute inset-0 right-0 left-0 mx-auto flex w-full max-w-470 flex-col items-center justify-center">
        <Loader2 className="text-brand-default h-8 w-8 animate-spin" />
        <p className="text-text-weak mt-4 text-sm">Loading map data...</p>
      </section>
    );
  }

  const renderFilters = () => (
    <>
      <label className="space-y-1.5">
        <span className="text-text-weaker text-[10px] font-semibold tracking-[0.08em] uppercase">
          State
        </span>
        <select
          value={selectedState}
          onChange={(event) => {
            setSelectedState(event.target.value);
            setSelectedRegion("all");
          }}
          className="border-line-weaker bg-surface-muted-100 text-text-strong focus:border-brand-default h-11 w-full rounded-md border px-3 text-sm outline-none"
        >
          {stateOptions.map((stateOption) => (
            <option key={stateOption} value={stateOption}>
              {stateOption === "all" ? "All States" : stateOption}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-text-weaker text-[10px] font-semibold tracking-[0.08em] uppercase">
          Region
        </span>
        <select
          value={selectedRegion}
          onChange={(event) => setSelectedRegion(event.target.value)}
          className="border-line-weaker bg-surface-muted-100 text-text-strong focus:border-brand-default h-11 w-full rounded-md border px-3 text-sm outline-none"
        >
          {regionOptions.map((regionOption) => (
            <option key={regionOption} value={regionOption}>
              {regionOption === "all" ? "All Regions" : regionOption}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-text-weaker text-[10px] font-semibold tracking-[0.08em] uppercase">
          From
        </span>
        <input
          type="date"
          value={selectedFromDate}
          onChange={(event) => setSelectedFromDate(event.target.value)}
          className="border-line-weaker bg-surface-muted-100 text-text-strong focus:border-brand-default h-11 w-full rounded-md border px-3 text-sm outline-none"
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-text-weaker text-[10px] font-semibold tracking-[0.08em] uppercase">
          To
        </span>
        <input
          type="date"
          value={selectedToDate}
          min={selectedFromDate}
          onChange={(event) => setSelectedToDate(event.target.value)}
          className="border-line-weaker bg-surface-muted-100 text-text-strong focus:border-brand-default h-11 w-full rounded-md border px-3 text-sm outline-none"
        />
      </label>
    </>
  );

  return (
    <section className="font-sf-pro mx-auto flex h-[calc(100vh-68px)] w-full max-w-470 flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12.5">
      {/* Desktop filters row */}
      <div className="hidden shrink-0 lg:grid lg:grid-cols-4 lg:gap-5">{renderFilters()}</div>

      <div className="border-line-weaker bg-fill-weak relative mt-4 min-h-75 w-full flex-1 overflow-hidden rounded-md border">
        {/* Mobile floating filters button */}
        <div className="absolute top-4 right-4 z-1000 lg:hidden">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="bg-brand-default hover:bg-brand-hover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        <SurfMapView
          spots={filteredSpots}
          activeSpotId={activeSpot?.id ?? null}
          onActiveSpotChange={setActiveSpotId}
        />

        {/* Mobile Spot Details Bottom Bar */}
        {activeSpot && (
          <div className="bg-surface-muted-100 border-line-weaker animate-in slide-in-from-bottom-4 absolute right-4 bottom-4 left-4 z-900 flex overflow-hidden rounded-xl border shadow-[0_10px_30px_rgba(0,0,0,0.2)] sm:hidden">
            <div className="relative min-h-25 w-1/3">
              <Image
                src={activeSpot.imageSrc}
                alt={activeSpot.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex w-2/3 flex-col justify-center p-3">
              <h3 className="text-text-strong line-clamp-1 text-sm leading-tight font-semibold">
                {activeSpot.name}
              </h3>
              <p className="text-text-weak mt-1 flex items-center gap-1 text-[11px]">
                <MapPin size={10} /> {activeSpot.state}, {activeSpot.country}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-text-weak text-[10px] font-medium">
                  {activeSpot.photoCount} Photos
                </p>
                <Link
                  href={`/gallery?locationId=${activeSpot.id}`}
                  className="bg-brand-default hover:bg-brand-hover rounded-md px-3 py-1.5 text-[11px] font-semibold text-white! transition-colors"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        )}

        {!activeSpot ? (
          <div className="pointer-events-none absolute inset-0 z-600 flex items-center justify-center">
            <p className="bg-surface-muted-100/95 text-text-weak rounded-md px-4 py-2 text-sm font-medium shadow-sm">
              No map locations match the selected filters.
            </p>
          </div>
        ) : null}
      </div>

      {/* Mobile Filters Bottom Sheet */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-1010 flex items-end justify-center bg-black/45 lg:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <div
            className="bg-surface-muted-100 w-full translate-y-0 rounded-t-2xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-text-strong text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="bg-line-weaker/50 text-text-strong hover:bg-line-weaker rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{renderFilters()}</div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="bg-brand-default hover:bg-brand-hover mt-8 w-full rounded-xl py-3.5 text-base font-semibold text-white shadow-sm transition-colors"
            >
              Show {filteredSpots.length} Results
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
