"use client";

import Image from "next/image";
import { CalendarDays, Camera, Clock3, Download, Loader2, MapPin, User, X } from "lucide-react";
import { PageTitle } from "@/components/shared/page-title";
import type { PurchaseLogItem } from "@/lib/api/services/order.service";
import { getAbsoluteImageUrl } from "@/lib/utils";

type PurchaseDetailsModalProps = {
  purchase: PurchaseLogItem | null;
  onClose: () => void;
  onDownloadOriginal?: (photoId: string, title?: string) => void;
  isDownloading?: boolean;
};

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 text-sm">
      <p className="text-text-weak">{label}</p>
      <p className="text-text-strong text-right font-medium">{value}</p>
    </div>
  );
}

export default function PurchaseDetailsModal({
  purchase,
  onClose,
  onDownloadOriginal,
  isDownloading,
}: PurchaseDetailsModalProps) {
  if (!purchase) {
    return null;
  }

  const formattedPurchaseDate = new Date(purchase.purchaseDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedCapturedDate = purchase.photo.capturedAt
    ? new Date(purchase.photo.capturedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

  const locationLabel = purchase.photo.location
    ? `${purchase.photo.location.name}${purchase.photo.location.state ? `, ${purchase.photo.location.state}` : ""}`
    : "Unknown location";

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Purchase details"
        onClick={(event) => event.stopPropagation()}
        className="border-line-weaker bg-surface-muted-100 max-h-[90vh] w-full max-w-260 overflow-y-auto rounded-lg border shadow-[0_20px_50px_rgba(15,23,42,0.35)]"
      >
        {/* Sticky Header */}
        <div className="border-line-weaker flex items-center justify-between border-b px-4 py-3 sticky top-0 bg-surface-muted-100 z-10">
          <h2 className="text-text-strong text-base font-semibold">Purchase Details</h2>
          <button
            type="button"
            aria-label="Close purchase details"
            onClick={onClose}
            className="border-line-weaker text-text-strong hover:bg-fill-hover inline-flex h-8 w-8 items-center justify-center rounded-sm border cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-5 p-4 md:grid-cols-[1.4fr_1fr] md:gap-8 md:p-6">
          {/* Left Side: Photo Preview */}
          <div className="relative min-h-75 h-80 md:h-full overflow-hidden rounded-sm">
            <Image
              src={getAbsoluteImageUrl(purchase.photo.imageUrl)}
              alt={purchase.photo.title || "Photo"}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
            />
          </div>

          {/* Right Side: Metadata & Financial Details */}
          <div>
            <PageTitle
              subtitlePosition="top"
              subtitle={purchase.photo.title || "Untitled Photo"}
              subtitleClassName="text-lg! leading-tight text-(--color-text-weak) sm:text-2xl! lg:text-[28px]!"
              title={`$${purchase.price.toFixed(2)}`}
              titleClassName="text-(--color-text-brand-strong) text-[34px]! leading-none sm:text-[46px]! lg:text-[58px]!"
            />

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2">
                <User size={14} className="text-text-weaker mt-0.5" />
                <div>
                  <p className="text-text-weaker text-xs">Buyer</p>
                  <p className="text-text-strong text-sm">
                    {purchase.buyer.name}{" "}
                    <span className="text-text-weak text-xs font-normal">
                      ({purchase.buyer.email})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Camera size={14} className="text-text-weaker mt-0.5" />
                <div>
                  <p className="text-text-weaker text-xs">Photographer</p>
                  <p className="text-text-strong text-sm">
                    {purchase.photo.photographer.name}{" "}
                    <span className="text-text-weak text-xs font-normal">
                      ({purchase.photo.photographer.email})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-text-weaker mt-0.5" />
                <div>
                  <p className="text-text-weaker text-xs">Location</p>
                  <p className="text-text-strong text-sm">{locationLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock3 size={14} className="text-text-weaker mt-0.5" />
                <div>
                  <p className="text-text-weaker text-xs">Purchased At</p>
                  <p className="text-text-strong text-sm">{formattedPurchaseDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CalendarDays size={14} className="text-text-weaker mt-0.5" />
                <div>
                  <p className="text-text-weaker text-xs">Date Taken</p>
                  <p className="text-text-strong text-sm">{formattedCapturedDate}</p>
                </div>
              </div>
            </div>

            {/* Financial & Order Specifications */}
            <div className="mt-8">
              <h4 className="text-text-strong text-lg font-semibold">Transaction Breakdown</h4>
              <div className="mt-3 space-y-2">
                <DetailItem label="Photo Price" value={`$${purchase.price.toFixed(2)}`} />
                <DetailItem
                  label="Photographer Earnings"
                  value={`$${purchase.photographerEarnings.toFixed(2)}`}
                />
                <DetailItem
                  label="Platform Commission"
                  value={`$${purchase.platformFee.toFixed(2)}`}
                />
                <DetailItem label="Order Status" value={purchase.orderStatus} />
                <DetailItem
                  label="Payout Status"
                  value={purchase.payoutStatus.replace(/_/g, " ")}
                />
                <DetailItem
                  label="Transaction Reference"
                  value={purchase.paypalOrderId || purchase.orderId}
                />
              </div>
            </div>

            {/* Download Original Photo Action */}
            <div className="mt-8 pt-6 border-t border-line-weaker">
              <button
                type="button"
                onClick={() =>
                  onDownloadOriginal?.(purchase.photo.id, purchase.photo.title || "Photo")
                }
                disabled={isDownloading}
                className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Preparing Original Download...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download Original Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
