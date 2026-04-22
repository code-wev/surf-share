import type { TopLocation } from "@/components/dashboard/overview/dashboard-overview-types";

type DashboardOverviewTopLocationsProps = {
  locations: TopLocation[];
};

export default function DashboardOverviewTopLocations({
  locations,
}: DashboardOverviewTopLocationsProps) {
  return (
    <section className="flex h-full flex-col">
      <h2 className="text-[20px] leading-tight font-semibold text-text-strong sm:text-[22px]">
        Top Locations
      </h2>

      <div className="mt-4 flex-1 space-y-3 sm:mt-6 sm:space-y-3.5 md:mt-8 md:space-y-4 xl:mt-9">
        {locations.map((location) => (
          <article key={location.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm leading-tight text-text-strong sm:text-base">
                {location.name}
              </p>
              <p className="shrink-0 text-[11px] text-text-weaker sm:text-[12px]">
                {location.photosLabel}
              </p>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8EEF7]">
              <div
                className="h-full rounded-full bg-brand-default"
                style={{ width: `${Math.max(0, Math.min(location.progress, 1)) * 100}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
