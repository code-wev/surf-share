"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ShoppingCart, UserRound } from "lucide-react";
import Footer from "@/components/shared/footer";

import {
  defaultFromDate,
  defaultToDate,
  demoSurfSpots,
  timeOptions,
  type SurfSpot,
  type TimeOptionValue,
} from "@/components/map/map-demo-data";

const SurfMapView = dynamic(() => import("@/components/map/surf-map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#d5dde2] text-sm text-text-weak">
      Loading map...
    </div>
  ),
});

const topNavItems = [
  { label: "Map", href: "/map", active: true },
  { label: "Gallery", href: "/gallery" },
  { label: "Contribute", href: "/contribute" },
  { label: "About", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

function toHumanDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function MapScreen() {
  const [selectedState, setSelectedState] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedFromDate, setSelectedFromDate] = useState(defaultFromDate);
  const [selectedToDate, setSelectedToDate] = useState(defaultToDate);
  const [selectedTime, setSelectedTime] = useState<TimeOptionValue>("all");
  const [activeSpotId, setActiveSpotId] = useState<string | null>(demoSurfSpots[0]?.id ?? null);

  const stateOptions = useMemo(() => {
    return ["all", ...Array.from(new Set(demoSurfSpots.map((spot) => spot.state)))];
  }, []);

  const regionOptions = useMemo(() => {
    const spots = selectedState === "all"
      ? demoSurfSpots
      : demoSurfSpots.filter((spot) => spot.state === selectedState);

    return ["all", ...Array.from(new Set(spots.map((spot) => spot.region)))];
  }, [selectedState]);

  const filteredSpots = useMemo(() => {
    return demoSurfSpots.filter((spot) => {
      const matchesState = selectedState === "all" || spot.state === selectedState;
      const matchesRegion = selectedRegion === "all" || spot.region === selectedRegion;
      const matchesTime = selectedTime === "all" || spot.timeWindows.includes(selectedTime);
      const inDateRange = !(selectedFromDate > spot.availableTo || selectedToDate < spot.availableFrom);

      return matchesState && matchesRegion && matchesTime && inDateRange;
    });
  }, [selectedRegion, selectedState, selectedTime, selectedFromDate, selectedToDate]);


  const resolvedActiveSpotId = filteredSpots.some((spot) => spot.id === activeSpotId)
    ? activeSpotId
    : filteredSpots[0]?.id ?? null;

  const activeSpot: SurfSpot | null = useMemo(() => {
    if (!filteredSpots.length) return null;
    return filteredSpots.find((spot) => spot.id === resolvedActiveSpotId) ?? filteredSpots[0];
  }, [filteredSpots, resolvedActiveSpotId]);

  return (
    <div className="min-h-screen bg-surface-muted-100 font-sf-pro">
      <header className="border-b border-line-weak bg-surface-muted-100">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="inline-flex">
            <Image src="/home/logo.png" alt="Surf Share" width={194} height={40} className="h-8 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {topNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  item.active
                    ? "text-sm font-semibold text-brand-default"
                    : "text-sm text-text-strong transition-colors hover:text-brand-default"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-strong transition-colors hover:bg-fill-weak"
              aria-label="Cart"
            >
              <ShoppingCart size={16} />
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line-weaker bg-surface-muted-100 text-text-strong transition-colors hover:bg-fill-weak"
              aria-label="Profile"
            >
              <UserRound size={15} />
            </button>
          </div>
        </div>
      </header>

      <section className="p-12.5">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-default sm:text-4xl">
          Find Your Wave
        </h1>
        <p className="mt-2 text-sm text-text-weak sm:text-base">
          Discover high-quality surf photography from world-class breaks.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_0.95fr_0.75fr]">
          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-text-strong">Location</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
                  State
                </span>
                <select
                  value={selectedState}
                  onChange={(event) => {
                    setSelectedState(event.target.value);
                    setSelectedRegion("all");
                  }}
                  className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
                >
                  {stateOptions.map((stateOption) => (
                    <option key={stateOption} value={stateOption}>
                      {stateOption === "all" ? "All States" : stateOption}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
                  Region
                </span>
                <select
                  value={selectedRegion}
                  onChange={(event) => setSelectedRegion(event.target.value)}
                  className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
                >
                  {regionOptions.map((regionOption) => (
                    <option key={regionOption} value={regionOption}>
                      {regionOption === "all" ? "All Regions" : regionOption}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-text-strong">Date Range</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
                  From
                </span>
                <input
                  type="date"
                  value={selectedFromDate}
                  onChange={(event) => setSelectedFromDate(event.target.value)}
                  className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
                  To
                </span>
                <input
                  type="date"
                  value={selectedToDate}
                  min={selectedFromDate}
                  onChange={(event) => setSelectedToDate(event.target.value)}
                  className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-text-strong">Time</h2>
            <label className="space-y-1.5">
              <span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
                Window
              </span>
              <select
                value={selectedTime}
                onChange={(event) => setSelectedTime(event.target.value as TimeOptionValue)}
                className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
              >
                {timeOptions.map((timeOption) => (
                  <option key={timeOption.value} value={timeOption.value}>
                    {timeOption.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="relative mt-6 h-[64vh] min-h-[540px] w-full overflow-hidden border border-line-weaker bg-[#cfd7dd] sm:h-[68vh] sm:min-h-[600px] xl:h-[90vh] xl:min-h-[680px]">
          <SurfMapView
            spots={filteredSpots}
            activeSpotId={activeSpot?.id ?? null}
            onActiveSpotChange={setActiveSpotId}
          />

          {activeSpot ? (
            <article className="absolute top-4 left-1/2 z-[600] w-[290px] -translate-x-1/2 overflow-hidden rounded-sm border border-line-weaker bg-surface-muted-100 shadow-[0_14px_30px_rgba(15,23,42,0.14)] sm:top-8 sm:w-[320px] md:left-[39%] md:translate-x-0">
              <div className="relative h-44 w-full">
                <Image src={activeSpot.image} alt={activeSpot.name} fill className="object-cover" />
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h3 className="text-[30px] leading-tight font-semibold text-text-strong">
                    {activeSpot.name}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-text-weak">
                    <MapPin size={12} />
                    {activeSpot.state}, {activeSpot.country}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-line-weaker pt-3">
                  <p className="text-xs text-text-weak">{activeSpot.photoCount}+ Photos Available</p>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-sm bg-brand-default px-3 py-1.5 text-xs font-semibold text-text-inverse-strong transition-colors hover:bg-brand-hover"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="pointer-events-none absolute inset-0 z-[600] flex items-center justify-center">
              <p className="rounded-md bg-surface-muted-100/95 px-4 py-2 text-sm font-medium text-text-weak shadow-sm">
                No map locations match the selected filters.
              </p>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-text-weaker">
          Showing {filteredSpots.length} locations | {toHumanDate(selectedFromDate)} to{" "}
          {toHumanDate(selectedToDate)} | {selectedTime === "all" ? "All Times" : selectedTime}
        </p>
      </section>

      <Footer />
    </div>
  );
}
