"use client";

import {
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Copy,
  Download,
  Loader2,
  MapPin,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import type { PurchaseLogItem } from "@/lib/api/services/order.service";
import { getAbsoluteImageUrl } from "@/lib/utils";

type PurchaseDetailsModalProps = {
  purchase: PurchaseLogItem | null;
  onClose: () => void;
  onDownloadOriginal?: (photoId: string, title?: string) => void;
  isDownloading?: boolean;
};

export default function PurchaseDetailsModal({
  purchase,
  onClose,
  onDownloadOriginal,
  isDownloading,
}: PurchaseDetailsModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!purchase) {
    return null;
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formattedDate = new Date(purchase.purchaseDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const capturedDateFormatted = purchase.photo.capturedAt
    ? new Date(purchase.photo.capturedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Purchase details"
        onClick={(event) => event.stopPropagation()}
        className="border-line-weaker bg-surface-muted-100 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl border shadow-[0_20px_50px_rgba(15,23,42,0.35)]"
      >
        {/* Header */}
        <div className="border-line-weaker bg-surface-muted-100 sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-text-strong text-lg font-semibold">Purchase Details</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                purchase.orderStatus === "PAID"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : purchase.orderStatus === "PENDING"
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
              }`}
            >
              {purchase.orderStatus}
            </span>
          </div>
          <button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="border-line-weaker text-text-weak hover:text-text-strong hover:bg-fill-hover inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1.3fr]">
          {/* Left Column: Photo Preview & Metadata */}
          <div className="space-y-4">
            <div className="border-line-weaker bg-surface-muted-200 relative h-64 w-full overflow-hidden rounded-lg border">
              <Image
                src={getAbsoluteImageUrl(purchase.photo.imageUrl)}
                alt={purchase.photo.title || "Purchased Photo"}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>

            <div className="border-line-weaker bg-surface-muted-200/50 rounded-lg border p-4 space-y-3">
              <h3 className="text-text-strong font-medium text-base">
                {purchase.photo.title || "Untitled Photo"}
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-weak flex items-center gap-1.5">
                    <MapPin size={14} /> Location
                  </span>
                  <span className="text-text-strong font-medium">
                    {purchase.photo.location
                      ? `${purchase.photo.location.name}, ${purchase.photo.location.state}`
                      : "Unknown Location"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-weak flex items-center gap-1.5">
                    <CalendarDays size={14} /> Captured Date
                  </span>
                  <span className="text-text-strong">{capturedDateFormatted}</span>
                </div>

                {purchase.photo.width && purchase.photo.height ? (
                  <div className="flex items-center justify-between">
                    <span className="text-text-weak flex items-center gap-1.5">
                      <Camera size={14} /> Resolution
                    </span>
                    <span className="text-text-strong">
                      {purchase.photo.width} × {purchase.photo.height}
                      {purchase.photo.format ? ` (${purchase.photo.format.toUpperCase()})` : ""}
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between">
                  <span className="text-text-weak">Photo ID</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-text-weak truncate max-w-35">
                      {purchase.photo.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(purchase.photo.id, "photoId")}
                      className="text-text-weak hover:text-text-strong transition-colors"
                      title="Copy Photo ID"
                    >
                      {copiedKey === "photoId" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Download original button */}
              {onDownloadOriginal ? (
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={() =>
                    onDownloadOriginal(purchase.photo.id, purchase.photo.title || "SurfShare-Original")
                  }
                  className="bg-brand-default text-background hover:bg-brand-default/90 mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Downloading Original...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download Original Photo
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {/* Right Column: Transaction & User Details */}
          <div className="space-y-5">
            {/* Buyer Details */}
            <div className="border-line-weaker bg-surface-muted-200/50 rounded-lg border p-4">
              <p className="text-text-weak mb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} /> Buyer Information
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-brand-default/10 text-brand-default flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold">
                  {purchase.buyer.name?.[0]?.toUpperCase() || "B"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-strong font-medium truncate">{purchase.buyer.name}</p>
                  <p className="text-text-weak text-xs truncate">{purchase.buyer.email}</p>
                </div>
                <span className="border-line-weaker bg-surface-muted-100 text-text-weak rounded-md border px-2 py-0.5 text-xs font-medium">
                  {purchase.buyer.role}
                </span>
              </div>
            </div>

            {/* Photographer Details */}
            <div className="border-line-weaker bg-surface-muted-200/50 rounded-lg border p-4">
              <p className="text-text-weak mb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={13} /> Photographer (Creator)
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 text-emerald-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold">
                  {purchase.photo.photographer.name?.[0]?.toUpperCase() || "P"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-strong font-medium truncate">
                    {purchase.photo.photographer.name}
                  </p>
                  <p className="text-text-weak text-xs truncate">
                    {purchase.photo.photographer.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="border-line-weaker bg-surface-muted-200/50 rounded-lg border p-4">
              <p className="text-text-weak mb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={13} /> Financial Breakdown
              </p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-line-weaker">
                  <span className="text-text-weak">Photo Price</span>
                  <span className="text-text-strong font-bold text-base">
                    ${purchase.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-weak">Photographer Earnings</span>
                  <span className="text-emerald-400 font-medium">
                    ${purchase.photographerEarnings.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-weak">Platform Commission</span>
                  <span className="text-brand-default font-medium">
                    ${purchase.platformFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-text-weak">Payout Status</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-weak">
                    {purchase.payoutStatus.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Order & Transaction Reference */}
            <div className="border-line-weaker bg-surface-muted-200/50 rounded-lg border p-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-weak flex items-center gap-1.5">
                  <Clock3 size={14} /> Purchased At
                </span>
                <span className="text-text-strong">{formattedDate}</span>
              </div>

              {purchase.paypalOrderId ? (
                <div className="flex items-center justify-between">
                  <span className="text-text-weak">PayPal Order ID</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-text-strong bg-surface-muted-100 border border-line-weaker px-2 py-0.5 rounded">
                      {purchase.paypalOrderId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(purchase.paypalOrderId!, "paypalOrderId")}
                      className="text-text-weak hover:text-text-strong transition-colors"
                      title="Copy PayPal Order ID"
                    >
                      {copiedKey === "paypalOrderId" ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <span className="text-text-weak">Internal Order ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-text-weak truncate max-w-35">
                    {purchase.orderId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(purchase.orderId, "orderId")}
                    className="text-text-weak hover:text-text-strong transition-colors"
                    title="Copy Order ID"
                  >
                    {copiedKey === "orderId" ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
