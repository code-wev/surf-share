"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  DollarSign,
  Download,
  Eye,
  Loader2,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  orderService,
  type PurchaseLogItem,
  type PurchaseStatus,
} from "@/lib/api/services/order.service";
import { photoService } from "@/lib/api/services/photo.service";
import { getAbsoluteImageUrl } from "@/lib/utils";
import PurchaseDetailsModal from "./purchase-details-modal";

type FilterStatus = "ALL" | "PAID" | "PENDING" | "FAILED";

const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

const statusStyleMap: Record<PurchaseStatus, string> = {
  PAID: "bg-[#EAF9EF] text-[#22C55E]",
  FAILED: "bg-[#FCEBEC] text-[#F87171]",
  PENDING: "bg-[#FFF7E9] text-[#F59E0B]",
};

const statusIconMap: Record<PurchaseStatus, React.ElementType> = {
  PAID: Check,
  FAILED: X,
  PENDING: Clock3,
};

const statusLabelMap: Record<PurchaseStatus, string> = {
  PAID: "Paid",
  FAILED: "Failed",
  PENDING: "Pending",
};

export default function PurchaseLogsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [activePurchase, setActivePurchase] = useState<PurchaseLogItem | null>(null);
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<string | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-purchases", debouncedSearch, selectedStatus, currentPage, pageSize],
    queryFn: async () => {
      return await orderService.getAdminPurchases({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch.trim() || undefined,
        status: selectedStatus,
      });
    },
    staleTime: 30000,
  });

  const purchases = response?.data?.purchases || [];
  const stats = response?.data?.stats || {
    totalCompletedPurchases: 0,
    totalGrossVolume: 0,
    totalPlatformFees: 0,
    totalPhotographerEarnings: 0,
    totalUniqueBuyers: 0,
  };
  const meta = response?.meta || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  const handleDownloadOriginal = async (photoId: string, title?: string) => {
    setDownloadingPhotoId(photoId);
    try {
      toast.info("Preparing secure original download...");
      const safeTitle = (title || "Photo").replace(/[^a-zA-Z0-9-_]/g, "_");
      await photoService.downloadOriginal(photoId, `${safeTitle}.jpg`);
      toast.success("Download started!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download original photo. Please check permissions.");
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="pt-10 [font-family:var(--font-sf-pro)] md:pt-0">
      {/* Top Header: Matching Platform Uploads & User Management Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="border-brand-default text-brand-default inline-flex border-b pb-1 text-base font-medium sm:text-lg">
          Purchase Logs
        </h1>

        <div className="relative flex flex-wrap items-center gap-3 text-sm">
          <p className="text-text-weak">{meta.total} Purchases</p>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search
              size={14}
              className="text-text-weak pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buyer, photo, ID..."
              className="border-line-weaker bg-surface-muted-100 text-text-strong placeholder:text-text-weaker focus:border-brand-default h-9 w-full rounded-sm border pl-9 pr-8 text-xs focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-text-weak hover:text-text-strong absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          {/* Filter & Sort Dropdown */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="border-line-weaker bg-surface-muted-100 text-brand-default inline-flex h-9 items-center gap-2 rounded-sm border px-3 text-sm font-medium cursor-pointer"
            >
              Filter &amp; Sort
              <SlidersHorizontal size={14} />
            </button>

            {isFilterOpen ? (
              <div className="border-line-weaker bg-surface-muted-100 absolute top-11 right-0 z-20 w-48 overflow-hidden rounded-sm border shadow-lg">
                <p className="text-text-weak px-3 pt-2.5 pb-1 text-[11px] font-semibold tracking-wide uppercase">
                  Order Status
                </p>
                <ul className="py-1">
                  {FILTER_OPTIONS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStatus(opt.value);
                          setCurrentPage(1);
                          setIsFilterOpen(false);
                        }}
                        className={`hover:bg-fill-hover flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                          selectedStatus === opt.value
                            ? "bg-fill-disable font-medium text-brand-default"
                            : "text-text-weak"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {selectedStatus === opt.value ? (
                          <Check size={12} className="text-brand-default" />
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* KPI Cards: Exactly matching DashboardOverviewStatsGrid */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5 xl:grid-cols-4 xl:gap-6">
        <article className="border-line-weaker bg-surface-muted-100 rounded-sm border p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="bg-brand-disabled text-brand-default inline-flex h-8 w-8 items-center justify-center rounded-md sm:h-9 sm:w-9">
              <ShoppingBag size={14} />
            </div>
          </div>
          <p className="text-text-strong mt-5 text-[22px] leading-none sm:mt-6 sm:text-[24px]">
            {stats.totalCompletedPurchases.toLocaleString()}
          </p>
          <p className="text-text-weak mt-1 text-[11px] sm:text-xs">Completed Purchases</p>
        </article>

        <article className="border-line-weaker bg-surface-muted-100 rounded-sm border p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="bg-brand-disabled text-brand-default inline-flex h-8 w-8 items-center justify-center rounded-md sm:h-9 sm:w-9">
              <DollarSign size={14} />
            </div>
          </div>
          <p className="text-text-strong mt-5 text-[22px] leading-none sm:mt-6 sm:text-[24px]">
            ${stats.totalGrossVolume.toFixed(2)}
          </p>
          <p className="text-text-weak mt-1 text-[11px] sm:text-xs">Gross Revenue Collected</p>
        </article>

        <article className="border-line-weaker bg-surface-muted-100 rounded-sm border p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="bg-brand-disabled text-brand-default inline-flex h-8 w-8 items-center justify-center rounded-md sm:h-9 sm:w-9">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="text-text-strong mt-5 text-[22px] leading-none sm:mt-6 sm:text-[24px]">
            ${stats.totalPlatformFees.toFixed(2)}
          </p>
          <p className="text-text-weak mt-1 text-[11px] sm:text-xs">Platform Fees</p>
        </article>

        <article className="border-line-weaker bg-surface-muted-100 rounded-sm border p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="bg-brand-disabled text-brand-default inline-flex h-8 w-8 items-center justify-center rounded-md sm:h-9 sm:w-9">
              <Users size={14} />
            </div>
          </div>
          <p className="text-text-strong mt-5 text-[22px] leading-none sm:mt-6 sm:text-[24px]">
            ${stats.totalPhotographerEarnings.toFixed(2)}
          </p>
          <p className="text-text-weak mt-1 text-[11px] sm:text-xs">Photographer Payouts</p>
        </article>
      </div>

      {/* Table: Exactly matching ModeratorListTable & UserManagementTable */}
      <div className="border-line-weaker bg-surface-muted-100 mt-5 overflow-x-auto border">
        <table className="text-text-weak w-full min-w-280 border-collapse text-left text-sm xl:min-w-0">
          <thead>
            <tr className="border-line-weaker text-text-strong border-b bg-[#F8FAFC] text-xs font-semibold">
              <th className="px-2 py-2.5">Photo</th>
              <th className="px-2 py-2.5">Name</th>
              <th className="px-2 py-2.5">Buyer</th>
              <th className="px-2 py-2.5">Photographer</th>
              <th className="px-2 py-2.5">Price</th>
              <th className="px-2 py-2.5">Earnings / Fee</th>
              <th className="px-2 py-2.5">Date</th>
              <th className="px-2 py-2.5">Status</th>
              <th className="px-2 py-2.5">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-text-weak">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin text-brand-default" />
                    <span className="text-xs">Loading purchase logs...</span>
                  </div>
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-text-weak">
                  <p className="text-sm">No purchases found.</p>
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => {
                const StatusIcon = statusIconMap[purchase.orderStatus];
                const isDownloadingThis = downloadingPhotoId === purchase.photo.id;

                return (
                  <tr
                    key={purchase.id}
                    className="border-line-weaker border-b last:border-b-0 text-xs"
                  >
                    {/* Photo Thumbnail */}
                    <td className="px-2 py-2">
                      <Image
                        src={getAbsoluteImageUrl(purchase.photo.imageUrl)}
                        alt={purchase.photo.title || "Photo"}
                        width={56}
                        height={36}
                        className="h-9 w-14 rounded-xs object-cover"
                      />
                    </td>

                    {/* Photo Title & Spot */}
                    <td className="text-text-strong px-2 py-2 max-w-42.5">
                      <p className="truncate font-medium" title={purchase.photo.title}>
                        {purchase.photo.title}
                      </p>
                      <p className="text-text-weak text-[11px] truncate">
                        {purchase.photo.location ? purchase.photo.location.name : "N/A"}
                      </p>
                    </td>

                    {/* Buyer */}
                    <td className="px-2 py-2 max-w-42.5">
                      <p className="text-text-strong font-medium truncate">
                        {purchase.buyer.name}
                      </p>
                      <p className="text-text-weak text-[11px] truncate">{purchase.buyer.email}</p>
                    </td>

                    {/* Photographer */}
                    <td className="px-2 py-2 max-w-42.5">
                      <p className="text-text-strong font-medium truncate">
                        {purchase.photo.photographer.name}
                      </p>
                      <p className="text-text-weak text-[11px] truncate">
                        {purchase.photo.photographer.email}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="text-text-strong px-2 py-2 font-semibold whitespace-nowrap">
                      ${purchase.price.toFixed(2)}
                    </td>

                    {/* Earnings / Platform Fee */}
                    <td className="px-2 py-2 whitespace-nowrap text-text-weak text-[11px]">
                      <span className="text-emerald-600 font-medium">
                        ${purchase.photographerEarnings.toFixed(2)}
                      </span>
                      <span className="mx-1">/</span>
                      <span className="text-text-strong">
                        ${purchase.platformFee.toFixed(2)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-2 py-2 text-text-weak whitespace-nowrap">
                      {formatDate(purchase.purchaseDate)}
                    </td>

                    {/* Status Badge: Exact ModeratorListTable styling */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium ${
                          statusStyleMap[purchase.orderStatus]
                        }`}
                      >
                        <StatusIcon size={12} />
                        {statusLabelMap[purchase.orderStatus]}
                      </span>
                    </td>

                    {/* Action Buttons: Exact ModeratorListTable styling */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadOriginal(purchase.photo.id, purchase.photo.title)
                          }
                          disabled={isDownloadingThis}
                          className="text-text-strong hover:text-brand-default inline-flex cursor-pointer items-center gap-1 text-sm hover:underline disabled:opacity-50"
                          title="Download Original Photo"
                        >
                          {isDownloadingThis ? (
                            <Loader2 size={14} className="animate-spin text-brand-default" />
                          ) : (
                            <Download size={14} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePurchase(purchase)}
                          className="inline-flex cursor-pointer items-center gap-1 text-sm text-[#0EA5E9] hover:underline"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination: Exactly matching UserManagementPagination & visible when records exist */}
      {meta.total > 0 ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-text-weak sm:mt-6 sm:gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="inline-flex h-8 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-45 cursor-pointer"
          >
            <ChevronLeft size={12} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {Array.from({ length: meta.totalPages || 1 }, (_, index) => index + 1)
            .filter((p) => {
              if (meta.totalPages <= 7) return true;
              return (
                p === 1 ||
                p === meta.totalPages ||
                (p >= currentPage - 2 && p <= currentPage + 2)
              );
            })
            .map((page, idx, array) => {
              const prev = array[idx - 1];
              const showEllipsis = prev && page - prev > 1;

              return (
                <div key={page} className="flex items-center gap-1">
                  {showEllipsis ? <span className="px-1 text-text-weak">...</span> : null}
                  <button
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-sm cursor-pointer ${
                      currentPage === page
                        ? "bg-[#EEF2F7] text-text-strong font-medium"
                        : "text-text-weak hover:bg-fill-hover"
                    }`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}

          <button
            type="button"
            onClick={() => handlePageChange(Math.min(meta.totalPages || 1, currentPage + 1))}
            disabled={currentPage >= (meta.totalPages || 1)}
            className="inline-flex h-8 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-45 cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={12} />
          </button>
        </div>
      ) : null}

      {/* Purchase Details Modal */}
      <PurchaseDetailsModal
        purchase={activePurchase}
        onClose={() => setActivePurchase(null)}
        onDownloadOriginal={handleDownloadOriginal}
        isDownloading={downloadingPhotoId === activePurchase?.photo.id}
      />
    </section>
  );
}
