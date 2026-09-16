"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Copy,
  DollarSign,
  Download,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  orderService,
  type PurchaseLogItem,
} from "@/lib/api/services/order.service";
import { photoService } from "@/lib/api/services/photo.service";
import { getAbsoluteImageUrl } from "@/lib/utils";
import PurchaseDetailsModal from "./purchase-details-modal";

type StatusTab = "ALL" | "PAID" | "PENDING" | "FAILED";

const STATUS_TABS: { label: string; value: StatusTab }[] = [
  { label: "All Purchases", value: "ALL" },
  { label: "Completed (Paid)", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

export default function PurchaseLogsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusTab>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  const [activePurchase, setActivePurchase] = useState<PurchaseLogItem | null>(null);
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Transaction ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadOriginal = async (photoId: string, title?: string) => {
    setDownloadingPhotoId(photoId);
    try {
      toast.info("Preparing secure original download...");
      const safeTitle = (title || "Photo").replace(/[^a-zA-Z0-9-_]/g, "_");
      await photoService.downloadOriginal(photoId, `${safeTitle}.jpg`);
      toast.success("Download initiated!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download original photo. You may lack permission.");
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6 [font-family:var(--font-sf-pro)]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-text-strong text-2xl font-bold tracking-tight">Purchase Logs</h1>
          <p className="text-text-weak text-sm mt-1">
            Complete transaction history tracking purchased photos, buyers, photographers, and earnings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-line-weaker bg-surface-muted-100 text-text-strong hover:bg-fill-hover inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Sold */}
        <div className="border-line-weaker bg-surface-muted-100 rounded-xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-weak text-xs font-medium uppercase tracking-wider">
              Photos Sold
            </span>
            <div className="bg-brand-default/10 text-brand-default flex h-8 w-8 items-center justify-center rounded-lg">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="text-text-strong mt-2 text-2xl font-bold">
            {stats.totalCompletedPurchases.toLocaleString()}
          </p>
          <p className="text-text-weak text-xs mt-1">Completed purchases</p>
        </div>

        {/* Gross Revenue */}
        <div className="border-line-weaker bg-surface-muted-100 rounded-xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-weak text-xs font-medium uppercase tracking-wider">
              Gross Volume
            </span>
            <div className="bg-emerald-500/10 text-emerald-400 flex h-8 w-8 items-center justify-center rounded-lg">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-text-strong mt-2 text-2xl font-bold">
            ${stats.totalGrossVolume.toFixed(2)}
          </p>
          <p className="text-text-weak text-xs mt-1">Total revenue collected</p>
        </div>

        {/* Platform Fees */}
        <div className="border-line-weaker bg-surface-muted-100 rounded-xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-weak text-xs font-medium uppercase tracking-wider">
              Platform Fees
            </span>
            <div className="bg-sky-500/10 text-sky-400 flex h-8 w-8 items-center justify-center rounded-lg">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-text-strong mt-2 text-2xl font-bold">
            ${stats.totalPlatformFees.toFixed(2)}
          </p>
          <p className="text-text-weak text-xs mt-1">Platform commissions</p>
        </div>

        {/* Photographer Earnings */}
        <div className="border-line-weaker bg-surface-muted-100 rounded-xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-weak text-xs font-medium uppercase tracking-wider">
              Photographer Earnings
            </span>
            <div className="bg-amber-500/10 text-amber-400 flex h-8 w-8 items-center justify-center rounded-lg">
              <Users size={16} />
            </div>
          </div>
          <p className="text-text-strong mt-2 text-2xl font-bold">
            ${stats.totalPhotographerEarnings.toFixed(2)}
          </p>
          <p className="text-text-weak text-xs mt-1">Creator payouts allocated</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="border-line-weaker bg-surface-muted-100 flex flex-col gap-3 rounded-xl border p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setSelectedStatus(tab.value);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-brand-default text-background font-semibold"
                    : "text-text-weak hover:text-text-strong hover:bg-surface-muted-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-80">
          <Search size={15} className="text-text-weak absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search buyer, photographer, photo, or ID..."
            className="border-line-weaker bg-surface-muted-200 text-text-strong placeholder:text-text-disabled w-full rounded-lg border py-1.5 pl-9 pr-3 text-xs outline-none focus:border-brand-default transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="border-line-weaker bg-surface-muted-100 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-line-weaker bg-surface-muted-200/50 border-b uppercase tracking-wider text-text-weak font-semibold">
              <tr>
                <th className="px-4 py-3.5">Photo</th>
                <th className="px-4 py-3.5">Buyer</th>
                <th className="px-4 py-3.5">Photographer</th>
                <th className="px-4 py-3.5 text-right">Price</th>
                <th className="px-4 py-3.5 text-right">Earnings / Fee</th>
                <th className="px-4 py-3.5">Transaction Ref</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-weaker">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-text-weak">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-brand-default" />
                      <p>Loading purchase logs...</p>
                    </div>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-text-weak">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingBag size={28} className="text-text-disabled" />
                      <p className="text-text-strong font-medium">No purchase records found</p>
                      <p className="text-xs max-w-sm">
                        {debouncedSearch
                          ? `No purchases matched "${debouncedSearch}". Try a different search.`
                          : "No photo purchases have been recorded yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => {
                  const isDownloadingThis = downloadingPhotoId === purchase.photo.id;
                  const displayTransactionId =
                    purchase.paypalOrderId || purchase.orderId.slice(0, 8);

                  return (
                    <tr
                      key={purchase.id}
                      className="hover:bg-surface-muted-200/40 transition-colors"
                    >
                      {/* Photo Thumbnail & Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-50">
                          <div
                            onClick={() => setActivePurchase(purchase)}
                            className="border-line-weaker relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-surface-muted-200"
                          >
                            <Image
                              src={getAbsoluteImageUrl(purchase.photo.imageUrl)}
                              alt={purchase.photo.title || "Photo"}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              onClick={() => setActivePurchase(purchase)}
                              className="text-text-strong font-medium hover:text-brand-default truncate max-w-40 cursor-pointer"
                              title={purchase.photo.title}
                            >
                              {purchase.photo.title}
                            </p>
                            <p className="text-text-weak text-[11px] truncate max-w-40">
                              {purchase.photo.location
                                ? `${purchase.photo.location.name}`
                                : "Location N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Buyer */}
                      <td className="px-4 py-3 min-w-45">
                        <div className="flex items-center gap-2">
                          <div className="bg-brand-default/10 text-brand-default flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                            {purchase.buyer.name?.[0]?.toUpperCase() || "B"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-text-strong font-medium truncate">
                              {purchase.buyer.name}
                            </p>
                            <p className="text-text-weak text-[11px] truncate">
                              {purchase.buyer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Photographer */}
                      <td className="px-4 py-3 min-w-42.5">
                        <div className="min-w-0">
                          <p className="text-text-strong font-medium truncate">
                            {purchase.photo.photographer.name}
                          </p>
                          <p className="text-text-weak text-[11px] truncate">
                            {purchase.photo.photographer.email}
                          </p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right font-semibold text-text-strong whitespace-nowrap">
                        ${purchase.price.toFixed(2)}
                      </td>

                      {/* Split: Photographer / Platform */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="text-emerald-400 font-medium">
                          ${purchase.photographerEarnings.toFixed(2)}
                        </span>
                        <span className="text-text-disabled mx-1">/</span>
                        <span className="text-brand-default font-medium">
                          ${purchase.platformFee.toFixed(2)}
                        </span>
                      </td>

                      {/* Transaction ID */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 font-mono text-[11px] text-text-weak bg-surface-muted-200/80 px-2 py-0.5 rounded border border-line-weaker">
                          <span className="truncate max-w-30">{displayTransactionId}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(purchase.paypalOrderId || purchase.orderId, purchase.id)
                            }
                            className="text-text-weak hover:text-text-strong ml-0.5 transition-colors"
                            title="Copy Transaction ID"
                          >
                            {copiedId === purchase.id ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-text-weak whitespace-nowrap">
                        {formatDate(purchase.purchaseDate)}
                      </td>

                      {/* Order Status */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            purchase.orderStatus === "PAID"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : purchase.orderStatus === "PENDING"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {purchase.orderStatus}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setActivePurchase(purchase)}
                            title="View Purchase Details"
                            className="border-line-weaker text-text-weak hover:text-text-strong hover:bg-fill-hover inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Download Original Photo */}
                          <button
                            type="button"
                            disabled={isDownloadingThis}
                            onClick={() =>
                              handleDownloadOriginal(
                                purchase.photo.id,
                                purchase.photo.title || "Photo"
                              )
                            }
                            title="Download Original Photo"
                            className="border-line-weaker text-text-weak hover:text-brand-default hover:bg-fill-hover inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {isDownloadingThis ? (
                              <Loader2 size={14} className="animate-spin text-brand-default" />
                            ) : (
                              <Download size={14} />
                            )}
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

        {/* Pagination Footer */}
        {meta.totalPages > 1 ? (
          <div className="border-line-weaker bg-surface-muted-200/30 flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
            <p className="text-text-weak text-xs">
              Showing{" "}
              <span className="text-text-strong font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="text-text-strong font-medium">
                {Math.min(currentPage * pageSize, meta.total)}
              </span>{" "}
              of <span className="text-text-strong font-medium">{meta.total}</span> purchases
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="border-line-weaker bg-surface-muted-100 text-text-weak hover:text-text-strong hover:bg-surface-muted-200 rounded-lg border px-2.5 py-1 text-xs font-medium disabled:opacity-40 cursor-pointer transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === meta.totalPages ||
                    (p >= currentPage - 2 && p <= currentPage + 2)
                  );
                })
                .map((page, index, array) => {
                  const prev = array[index - 1];
                  const showEllipsis = prev && page - prev > 1;

                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis ? (
                        <span className="text-text-disabled px-1 text-xs">...</span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-7 rounded-lg px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
                          currentPage === page
                            ? "bg-brand-default text-background font-semibold"
                            : "border border-line-weaker bg-surface-muted-100 text-text-weak hover:text-text-strong hover:bg-surface-muted-200"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}

              <button
                type="button"
                disabled={currentPage >= meta.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                className="border-line-weaker bg-surface-muted-100 text-text-weak hover:text-text-strong hover:bg-surface-muted-200 rounded-lg border px-2.5 py-1 text-xs font-medium disabled:opacity-40 cursor-pointer transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Purchase Details Modal */}
      <PurchaseDetailsModal
        purchase={activePurchase}
        onClose={() => setActivePurchase(null)}
        onDownloadOriginal={handleDownloadOriginal}
        isDownloading={downloadingPhotoId === activePurchase?.photo.id}
      />
    </div>
  );
}
