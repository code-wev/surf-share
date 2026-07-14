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

import ContributorListTable, { type ContributorListTableRow } from "./contributor-list-table";
import UploadDetailsModal from "./upload-details-modal";
import EditUploadModal from "./edit-upload-modal";
import DeleteUploadModal from "./delete-upload-modal";
import { useMyPhotosQuery } from "@/hooks/api/usePhotos";
import type { IPhotoResponse } from "@/lib/api/services/photo.service";
import { useLocationsQuery } from "@/hooks/api/useLocations";
import { getAbsoluteImageUrl, formatFileSize } from "@/lib/utils";

type Location = {
  id: string;
  name: string;
};

function formatApiDate(dateValue: string) {
  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatApiTime(dateValue: string) {
  return new Date(dateValue).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

const uploadStatuses = ["all", "approved", "rejected", "pending"] as const;
type UploadStatusFilter = (typeof uploadStatuses)[number];

const uploadStatusLabels: Record<UploadStatusFilter, string> = {
  all: "All Status",
  approved: "Approved",
  rejected: "Rejected",
  pending: "Pending",
};

type EnrichedUploadRow = ContributorListTableRow & {
  uploadedAt: string;
  timeLabel: string;
  priceValue: number;
  locationId: string;
  photographer: string;
  resolution: string;
  format: string;
  size: string;
};

const PAGE_SIZE = 10;

// Helper to map DB status to UI status type
function mapStatus(dbStatus: string): "approved" | "rejected" | "pending" | "processing" {
  const s = dbStatus.toLowerCase();
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  if (s === "processing") return "processing";
  return "pending";
}

function mapApiPhotoToRow(item: IPhotoResponse): EnrichedUploadRow {
  const takenAt = item.capturedAt || item.createdAt;

  return {
    id: item.id,
    photoUrl: getAbsoluteImageUrl(item.imageUrl),
    name: item.title || "Photo",
    location: `${item.location.name}, ${item.location.state}`,
    dateLabel: formatApiDate(takenAt),
    timeLabel: formatApiTime(takenAt),
    priceLabel: `$${item.price.toFixed(2)}`,
    status: mapStatus(item.status),
    uploadedAt: takenAt,
    priceValue: item.price,
    locationId: item.locationId,
    photographer: "You",
    resolution: item.width && item.height ? `${item.width}x${item.height}` : "Unknown",
    format: item.format?.toUpperCase() || "JPEG",
    size: formatFileSize(item.fileSize),
  };
}

export default function ContributorMyUploadsPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<UploadStatusFilter>("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<"location" | "status" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUpload, setSelectedUpload] = useState<EnrichedUploadRow | null>(null);
  const [editingUpload, setEditingUpload] = useState<EnrichedUploadRow | null>(null);
  const [deletingUpload, setDeletingUpload] = useState<EnrichedUploadRow | null>(null);

  // Dynamic Location Data for Filter
  const { data: locationsData } = useLocationsQuery({ page: 1, limit: 100 });
  const locations = useMemo(() => locationsData?.data || [], [locationsData]);

  // Dynamic Photo Data
  const { data, isLoading } = useMyPhotosQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    status: selectedStatus === "all" ? undefined : selectedStatus.toUpperCase(),
    locationId: selectedLocationId === "all" ? undefined : selectedLocationId,
  });

  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalItems = meta?.total || 0;

  const uploads = useMemo<EnrichedUploadRow[]>(() => {
    const apiPhotos = data?.data || [];
    return apiPhotos.map(mapApiPhotoToRow);
  }, [data?.data]);

  const handleLocationSelect = (id: string) => {
    setSelectedLocationId(id);
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

  const handleDelete = (row: EnrichedUploadRow) => {
    setDeletingUpload(row);
  };

  const handleEdit = (row: EnrichedUploadRow) => {
    setEditingUpload(row);
  };

  if (isLoading) {
    return <div className="py-20 text-center">Loading your uploads...</div>;
  }

  return (
    <section className="pt-10 [font-family:var(--font-sf-pro)] md:pt-0">
      <div className="flex items-center justify-between gap-3">
        <h1 className="border-brand-default text-brand-default inline-flex border-b pb-1 text-base font-medium sm:text-lg">
          My Uploads
        </h1>

        <div className="relative flex items-center gap-3 text-sm">
          <p className="text-text-weak">{totalItems} Images</p>
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
                    All Locations
                  </button>
                  {locations.map((loc: Location) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleLocationSelect(loc.id)}
                      className={`hover:bg-fill-hover w-full px-4 py-2 text-left text-sm ${
                        selectedLocationId === loc.id
                          ? "text-text-strong font-medium"
                          : "text-text-weak"
                      }`}
                    >
                      {loc.name}
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

      <ContributorListTable
        rows={uploads}
        onViewDetails={setSelectedUpload}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination - Only shown if needed */}
      {totalPages > 1 ? (
        <div className="text-text-weak mt-6 flex items-center justify-center gap-1.5 text-sm sm:gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
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
                page === currentPage
                  ? "text-text-strong bg-[#EEF2F7] font-semibold"
                  : "text-text-weak hover:bg-fill-hover"
              }`}
            >
              {page}
            </button>
          ))}

          {totalPages > 4 && currentPage < totalPages - 2 ? (
            <span className="px-1">...</span>
          ) : null}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
            className="inline-flex h-9 items-center gap-1 rounded-sm px-2 disabled:opacity-45"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      ) : null}

      {/* View Details Modal */}
      <UploadDetailsModal upload={selectedUpload} onClose={() => setSelectedUpload(null)} />

      {/* Edit Details Modal */}
      <EditUploadModal upload={editingUpload} onClose={() => setEditingUpload(null)} />

      {/* Delete Confirmation Modal */}
      <DeleteUploadModal upload={deletingUpload} onClose={() => setDeletingUpload(null)} />
    </section>
  );
}
