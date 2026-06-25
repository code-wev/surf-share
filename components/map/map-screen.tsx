"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useMapLocationsQuery } from "@/hooks/api/useLocations";
import { Loader2 } from "lucide-react";

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

  return (
    <section className="font-sf-pro mx-auto flex h-[calc(100vh-68px)] w-full max-w-470 flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12.5">
      <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
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
      </div>

      <div className="border-line-weaker bg-fill-weak relative mt-4 min-h-75 w-full flex-1 overflow-hidden rounded-md border">
        <SurfMapView
          spots={filteredSpots}
          activeSpotId={activeSpot?.id ?? null}
          onActiveSpotChange={setActiveSpotId}
        />

        {!activeSpot ? (
          <div className="pointer-events-none absolute inset-0 z-600 flex items-center justify-center">
            <p className="bg-surface-muted-100/95 text-text-weak rounded-md px-4 py-2 text-sm font-medium shadow-sm">
              No map locations match the selected filters.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
