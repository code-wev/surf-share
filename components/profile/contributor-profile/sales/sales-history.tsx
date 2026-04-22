"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightSmall,
  Clock3,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";

import {
  galleryLocationLabels,
  galleryLocations,
  type GalleryLocation,
} from "@/components/home/gallery/gallery-images";
import {
  ContributorUploadApiItem,
  ContributorUploadRow,
  mockApiResponse,
} from "../my-uploads/my-upload-data";
import UploadDetailsModal from "../my-uploads/upload-details-modal";
import SaleHistoryTable, { SaleHistoryTableRow } from "./sales-history-list";

function formatApiDate(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function mapApiUploadToRow(item: ContributorUploadApiItem): ContributorUploadRow {
  return {
    id: item.id,
    photoUrl: item.photoUrl,
    name: item.name,
    location: item.location,
    dateLabel: formatApiDate(item.uploadedAt),
    priceLabel: `$${item.priceUsd}`,
    status: item.status,
  };
}

const uploadStatuses = ["all", "approved", "rejected", "pending"] as const;
type UploadStatusFilter = (typeof uploadStatuses)[number];

const uploadStatusLabels: Record<UploadStatusFilter, string> = {
  all: "All Status",
  approved: "Approved",
  rejected: "Rejected",
  pending: "Pending",
};

type EnrichedUploadRow = SaleHistoryTableRow & {
  uploadedAt: string;
  priceValue: number;
  locationKey: GalleryLocation;
  photographer: string;
  resolution: string;
  format: string;
  size: string;
};

const PAGE_SIZE = mockApiResponse.pageSize;

function getLocationKeyFromLabel(locationLabel: string): GalleryLocation {
  if (locationLabel.includes("Trigg")) return "trigg";
  if (locationLabel.includes("Cottesloe")) return "cottesloe";
  if (locationLabel.includes("Scarborough")) return "scarborough";
  if (locationLabel.includes("Bells")) return "bellsBeach";
  if (locationLabel.includes("Byron")) return "byronBay";
  if (locationLabel.includes("Bondi")) return "bondi";
  if (locationLabel.includes("Manly")) return "manly";
  return "all";
}

function buildModalDetailsFromUpload(item: ContributorUploadApiItem) {
  return {
    photographer: item.photographer ?? "Julian Wave Rossi",
    resolution: item.resolution ?? "7860 x 4370 px",
    format: item.format ?? "RAW / JPEG",
    size: item.size ?? "24.8 MB",
  };
}

export default function ContributorSalesHistoryPage() {
  const [selectedLocation, setSelectedLocation] = useState<GalleryLocation>("all");
  const [selectedStatus, setSelectedStatus] = useState<UploadStatusFilter>("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<"location" | "status" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUpload, setSelectedUpload] = useState<EnrichedUploadRow | null>(null);

  const uploads = useMemo<EnrichedUploadRow[]>(
    () =>
      mockApiResponse.items.map((item) => {
        const modalDetails = buildModalDetailsFromUpload(item);
        return {
          ...mapApiUploadToRow(item),
          uploadedAt: item.uploadedAt,
          priceValue: item.priceUsd,
          locationKey: getLocationKeyFromLabel(item.location),
          photographer: modalDetails.photographer,
          resolution: modalDetails.resolution,
          format: modalDetails.format,
          size: modalDetails.size,
          commissionUsd: item.commissionUsd ?? item.priceUsd * 0.3,
          totalDownloads: item.totalDownloads ?? 0,
          earningsUsd: item.earningsUsd ?? item.priceUsd * (item.totalDownloads ?? 0) * 0.7,
        };
      }),
    [],
  );

  const filteredUploads = useMemo(() => {
    const filtered = uploads.filter((upload) => {
      const matchesLocation = selectedLocation === "all" || upload.locationKey === selectedLocation;
      const matchesStatus = selectedStatus === "all" || upload.status === selectedStatus;
      return matchesLocation && matchesStatus;
    });

    return filtered;
  }, [selectedLocation, selectedStatus, uploads]);

  const totalPages = Math.max(1, Math.ceil(filteredUploads.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedUploads = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredUploads.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredUploads, safeCurrentPage]);

  const handleLocationSelect = (value: GalleryLocation) => {
    setSelectedLocation(value);
    setCurrentPage(1);
    setShowFilterPanel(false);
    setActiveSubmenu(null);
  };

  const handleStatusSelect = (value: UploadStatusFilter) => {
    setSelectedStatus(value);
    setCurrentPage(1);
    setShowFilterPanel(false);
    setActiveSubmenu(null);
  };

  return (
    <section className="[font-family:var(--font-sf-pro)]">
      <div className="flex items-center justify-between gap-3">
        <h1 className="border-brand-default text-brand-default inline-flex border-b pb-1 text-base font-medium sm:text-lg">
          Sales History
        </h1>

        <div className="relative flex items-center gap-3 text-sm">
          <p className="text-text-weak">{filteredUploads.length} Images</p>
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
                  {galleryLocations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleLocationSelect(location)}
                      className={`hover:bg-fill-hover w-full px-4 py-2 text-left text-sm ${
                        selectedLocation === location
                          ? "text-text-strong font-medium"
                          : "text-text-weak"
                      }`}
                    >
                      {galleryLocationLabels[location]}
                    </button>
                  ))}
                </div>
              ) : null}

              {activeSubmenu === "status" ? (
                <div className="border-line-weaker bg-surface-muted-100 w-full overflow-hidden rounded-md border shadow-lg md:mt-6 md:mr-1 md:w-44">
                  {uploadStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusSelect(status)}
                      className={`hover:bg-fill-hover w-full px-4 py-2 text-left text-sm ${
                        selectedStatus === status
                          ? "text-text-strong font-medium"
                          : "text-text-weak"
                      }`}
                    >
                      {uploadStatusLabels[status]}
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

                <button
                  type="button"
                  onClick={() =>
                    setActiveSubmenu((previous) => (previous === "status" ? null : "status"))
                  }
                  className={`hover:bg-fill-hover flex w-full items-center gap-3 px-4 py-3 text-sm ${
                    activeSubmenu === "status" ? "bg-fill-hover" : ""
                  }`}
                >
                  <Clock3 size={16} />
                  <span className="text-text-strong flex-1 text-left">Status</span>
                  <ChevronRightSmall size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <SaleHistoryTable rows={pagedUploads} onViewDetails={setSelectedUpload} />

      {/* Pagination */}
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

        {totalPages > 4 ? <span className="px-1">...</span> : null}

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

      {/* View Details Modal */}
      <UploadDetailsModal upload={selectedUpload} onClose={() => setSelectedUpload(null)} />
    </section>
  );
}
