"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightSmall,
  MapPin,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

import SaleHistoryTable, { SaleHistoryTableRow } from "./sales-history-list";
import { useMySales } from "@/hooks/api/useSales";
import { useAuth } from "@/lib/auth";
import { useAllLocationsQuery } from "@/hooks/api/useLocations";

type Location = {
  id: string;
  name: string;
};

function formatApiDate(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const PAGE_SIZE = 10;

export default function ContributorSalesHistoryPage() {
  const { session } = useAuth();
  const { data: locationsData } = useAllLocationsQuery();
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  const { data, isLoading, isError } = useMySales(
    selectedLocationId === "all" ? undefined : selectedLocationId,
  );

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<"location" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const locations = useMemo(() => {
    return locationsData || [];
  }, [locationsData]);

  const uploads = useMemo<SaleHistoryTableRow[]>(
    () =>
      (data?.items || []).map((item) => {
        return {
          id: item.id,
          photoUrl: item.photoUrl,
          name: item.name,
          location: item.location,
          dateLabel: formatApiDate(item.uploadedAt),
          priceLabel: `$${item.priceUsd}`,
          status: item.status,
          uploadedAt: item.uploadedAt,
          priceValue: item.priceUsd,
          photographer: session?.name || "Photographer",
          resolution: item.resolution || "N/A",
          format: item.format || "N/A",
          size: item.size || "N/A",
          commissionUsd: item.commissionUsd,
          totalDownloads: item.totalDownloads,
          earningsUsd: item.earningsUsd,
        } as SaleHistoryTableRow;
      }),
    [data?.items, session?.name],
  );

  const totalPages = Math.max(1, Math.ceil(uploads.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedUploads = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return uploads.slice(startIndex, startIndex + PAGE_SIZE);
  }, [uploads, safeCurrentPage]);

  const handleLocationSelect = (id: string) => {
    setSelectedLocationId(id);
    setCurrentPage(1);
    setShowFilterPanel(false);
    setActiveSubmenu(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-brand-default h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger-strong flex h-64 items-center justify-center">
        Failed to load sales history. Please try again later.
      </div>
    );
  }

  return (
    <section className="pt-10 [font-family:var(--font-sf-pro)] md:pt-0">
      <div className="flex items-center justify-between gap-3">
        <h1 className="border-brand-default text-brand-default inline-flex border-b pb-1 text-base font-medium sm:text-lg">
          Sales History
        </h1>

        <div className="relative flex items-center gap-3 text-sm">
          <p className="text-text-weak">{uploads.length} Images</p>
          <button
            type="button"
            onClick={() => {
              setShowFilterPanel((previous) => !previous);
              setActiveSubmenu(null);
            }}
            className="border-line-weaker bg-surface-muted-100 text-brand-default inline-flex h-9 items-center gap-2 rounded-sm border px-3 text-sm font-medium"
          >
            Filter &amp; Sort
            <SlidersHorizontal size={14} />
          </button>

          {showFilterPanel ? (
            <div className="absolute top-11 right-0 z-20 flex w-[92vw] max-w-105 flex-col gap-2 sm:w-105 md:w-auto md:max-w-none md:flex-row md:items-start md:gap-0">
              {activeSubmenu === "location" ? (
                <div className="border-line-weaker bg-surface-muted-100 w-full overflow-hidden rounded-md border shadow-lg md:mt-6 md:mr-1 md:w-52">
                  <p className="text-text-weak px-4 pt-3 pb-1 text-xs font-semibold tracking-wide uppercase">
                    Regions
                  </p>
                  <button
                    type="button"
                    onClick={() => handleLocationSelect("all")}
                    className={`hover:bg-fill-hover w-full px-4 py-2 text-left text-sm ${
                      selectedLocationId === "all"
                        ? "text-text-strong font-medium"
                        : "text-text-weak"
                    }`}
                  >
                    All Regions
                  </button>
                  {locations.map((location: Location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => handleLocationSelect(location.id)}
                      className={`hover:bg-fill-hover w-full px-4 py-2 text-left text-sm ${
                        selectedLocationId === location.id
                          ? "text-text-strong font-medium"
                          : "text-text-weak"
                      }`}
                    >
                      {location.name}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="border-line-weaker bg-surface-muted-100 w-full overflow-hidden rounded-md border shadow-lg md:w-56">
                <div className="border-line-weaker flex items-center justify-between border-b px-4 py-3">
                  <span className="text-brand-default text-sm font-medium">Filter &amp; Sort</span>
                  <SlidersHorizontal size={16} className="text-text-weak" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSubmenu((previous) => (previous === "location" ? null : "location"))
                  }
                  className={`hover:bg-fill-hover flex w-full items-center gap-3 px-4 py-3 text-sm ${
                    activeSubmenu === "location" ? "bg-fill-hover" : ""
                  }`}
                >
                  <MapPin size={16} />
                  <span className="text-text-strong flex-1 text-left">Location</span>
                  <ChevronRightSmall size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {uploads.length === 0 ? (
        <div className="border-line-weaker bg-surface-muted-100 text-text-weak mt-5 flex h-40 items-center justify-center border text-sm">
          No sales found for the selected filters.
        </div>
      ) : (
        <SaleHistoryTable rows={pagedUploads} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="text-text-weak mt-6 flex items-center justify-center gap-1.5 text-sm sm:gap-2">
          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
            className="inline-flex h-9 items-center gap-1 rounded-sm px-2 disabled:opacity-45"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-sm ${
                page === safeCurrentPage
                  ? "text-text-strong bg-[#EEF2F7] font-semibold"
                  : "text-text-weak hover:bg-fill-hover"
              }`}
            >
              {page}
            </button>
          ))}

          {totalPages > 4 && safeCurrentPage < totalPages - 2 ? (
            <span className="px-1">...</span>
          ) : null}

          <button
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
            className="inline-flex h-9 items-center gap-1 rounded-sm px-2 disabled:opacity-45"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
