import { ImageIcon, MapPin, Plus, Search, SquarePen, Trash2, ChevronLeft, ChevronRight, Star } from "lucide-react";

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
  onToggleFeatured?: (location: LocationModerationItem) => void;
  isPending?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
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
  onToggleFeatured,
  isPending,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: LocationsModerationSidebarProps) {
  return (
    <aside className="bg-surface-muted-100 flex min-h-0 w-full flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl leading-tight font-medium text-text-strong sm:text-[22px]">Locations</h2>

        <button
          type="button"
          onClick={onAddLocation}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-brand-default px-4 text-sm text-text-inverse-strong transition-colors cursor-pointer hover:bg-brand-hover sm:w-auto sm:px-5 sm:py-2.5 sm:text-base [font-family:var(--font-sf-pro)]"
        >
          Add Location
          <Plus size={14} />
        </button>
      </div>

      <div className="mt-4 sm:mt-6 lg:my-9">
        <label className="relative block">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-text-weaker"
          />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search location"
            className="h-10 w-full rounded-[10px] border border-line-weaker bg-surface-muted-100 pl-8 pr-3 text-sm text-text-strong outline-none placeholder:text-text-weaker focus:border-brand-default sm:h-9 sm:text-xs"
          />
        </label>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {locations.map((location) => {
          const isActive = activeLocationId === location.id;

          return (
            <article
              key={location.id}
              className={`cursor-pointer rounded-sm border-b border-line-weaker px-2 py-3 transition-colors sm:px-1 sm:py-2 ${
                isActive ? "bg-fill-disable" : "hover:bg-fill-hover"
              }`}
              onClick={() => onSelectLocation(location.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg leading-tight font-medium text-text-strong sm:text-[22px]">
                  {location.name}
                </p>

                <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                  {onToggleFeatured && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFeatured(location);
                      }}
                      className={`${
                        location.isFeatured ? "text-yellow-400" : "text-text-weaker"
                      } transition-colors hover:text-yellow-500`}
                      aria-label={`Toggle featured for ${location.name}`}
                    >
                      <Star size={18} fill={location.isFeatured ? "currentColor" : "none"} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditLocation(location);
                    }}
                    className="text-text-weaker transition-colors hover:text-brand-default"
                    aria-label={`Edit ${location.name}`}
                  >
                    <SquarePen size={18} color="black" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteLocation(location);
                    }}
                    disabled={isPending}
                    className="text-[#f87171] transition-colors hover:text-[#ef4444] disabled:opacity-50"
                    aria-label={`Delete ${location.name}`}
                  >
                    <Trash2 size={18} color="red" />
                  </button>
                </div>
              </div>

              <p className="mt-1 inline-flex items-center gap-2 text-xs text-text-weaker sm:text-sm">
                <MapPin size={13} />
                {location.region}, {location.state}
              </p>

              <div className="mt-1 flex items-center justify-between">
                <p className="inline-flex items-center gap-2 text-sm text-text-weak sm:text-lg [font-family:var(--font-sf-pro)]">
                  <ImageIcon size={16} className="sm:h-5 sm:w-5" />
                  {location.photosAvailable} Photos
                </p>
                <span className="inline-flex rounded-sm bg-success-disable px-2 py-0.5 text-[11px] font-medium text-success-strong">
                  Active
                </span>
              </div>
            </article>
          );
        })}

        {locations.length === 0 ? (
          <div className="px-4 py-6 text-sm text-text-weaker">No locations found.</div>
        ) : null}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex shrink-0 items-center justify-between border-t border-line-weaker pt-4">
          <p className="text-xs text-text-weaker sm:text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line-weaker bg-white text-text-strong transition-colors hover:bg-fill-hover disabled:opacity-50 sm:h-9 sm:w-9"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line-weaker bg-white text-text-strong transition-colors hover:bg-fill-hover disabled:opacity-50 sm:h-9 sm:w-9"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
