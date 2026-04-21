import { ImageIcon, MapPin, Plus, Search, SquarePen, Trash2 } from "lucide-react";

import type { LocationModerationItem } from "@/components/dashboard/locations-moderation/locations-moderation-types";

type LocationsModerationSidebarProps = {
  locations: LocationModerationItem[];
  activeLocationId: string | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectLocation: (locationId: string) => void;
  onAddLocation: () => void;
  onEditLocation: (location: LocationModerationItem) => void;
  onDeleteLocation: (location: LocationModerationItem) => void;
};

export default function LocationsModerationSidebar({
  locations,
  activeLocationId,
  searchValue,
  onSearchChange,
  onSelectLocation,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
}: LocationsModerationSidebarProps) {
  return (
    <aside className="bg-surface-muted-100 flex min-h-0 flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] leading-tight font-medium text-text-strong">Locations</h2>

        <button
          type="button"
          onClick={onAddLocation}
          className="inline-flex px-5 py-2.5 items-center gap-2 rounded-sm bg-brand-default text-md text-text-inverse-strong transition-colors cursor-pointer family-[var(--font-sf-pro)]"
        >
          Add Location
          <Plus size={14} />
        </button>
      </div>

      <div className="my-9">
        <label className="relative block">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-text-weaker"
          />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search location"
            className="h-9 w-full rounded-[10px] border border-line-weaker bg-surface-muted-100 pl-8 pr-3 text-xs text-text-strong outline-none placeholder:text-text-weaker focus:border-brand-default"
          />
        </label>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {locations.map((location) => {
          const isActive = activeLocationId === location.id;

          return (
            <article
              key={location.id}
              className={`cursor-pointer border-b border-line-weaker transition-colors py-2 px-1 rounded-sm ${
                isActive ? "bg-fill-disable" : "hover:bg-fill-hover"
              }`}
              onClick={() => onSelectLocation(location.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[22px] leading-tight font-medium text-text-strong">{location.name}</p>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditLocation(location);
                    }}
                    className="text-text-weaker transition-colors hover:text-brand-default"
                    aria-label={`Edit ${location.name}`}
                  >
                    <SquarePen size={20} color="black"/>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteLocation(location);
                    }}
                    className="text-[#f87171] transition-colors hover:text-[#ef4444]"
                    aria-label={`Delete ${location.name}`}
                  >
                    <Trash2 size={20} color="red"/>
                  </button>
                </div>
              </div>

              <p className="mt-1 inline-flex items-center gap-2 text-sm text-text-weaker">
                <MapPin size={14} />
                {location.region}, {location.country}
              </p>

              <div className="mt-1 flex items-center justify-between">
                <p className="inline-flex items-center gap-2 text-lg family-[var(--font-sf-pro)] text-text-weak">
                  <ImageIcon size={20} />
                  {location.region}, {location.country}
                </p>
                <span className="inline-flex rounded-sm bg-success-disable px-2 py-0.5 text-[11px] font-medium text-success-strong">
                  {location.status}
                </span>
              </div>
            </article>
          );
        })}

        {locations.length === 0 ? (
          <div className="px-4 py-6 text-sm text-text-weaker">No locations found.</div>
        ) : null}
      </div>
    </aside>
  );
}
