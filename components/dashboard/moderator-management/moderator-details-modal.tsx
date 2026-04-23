import Image from "next/image";
import { ChevronsRight, SquarePen } from "lucide-react";

import type {
  ModeratorPlan,
  ModeratorRow,
  ModeratorStatus,
} from "@/components/dashboard/moderator-management/moderator-management-types";

type ModeratorDetailsModalProps = {
  moderator: ModeratorRow | null;
  planClassNameMap: Record<ModeratorPlan, string>;
  statusClassNameMap: Record<ModeratorStatus, string>;
  onClose: () => void;
};

type ModeratorDetailRowProps = {
  label: string;
  value: React.ReactNode;
};

const previewPhotoSources = [
  "/home/latest/latest1.jpg",
  "/home/latest/latest2.jpg",
  "/home/latest/latest3.jpg",
  "/home/latest/latest4.jpg",
] as const;

function ModeratorDetailRow({ label, value }: ModeratorDetailRowProps) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-x-12 gap-y-1 py-1 [font-family:var(--font-sf-pro)] text-xs leading-tight sm:grid-cols-[104px_minmax(0,1fr)] sm:text-sm">
      <span className="text-text-strong font-medium">{label}</span>
      <div className="text-text-weak min-w-0">{value}</div>
    </div>
  );
}

function InlineBadge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] ${className}`}>
      {children}
    </span>
  );
}

export default function ModeratorDetailsModal({
  moderator,
  planClassNameMap,
  statusClassNameMap,
  onClose,
}: ModeratorDetailsModalProps) {
  if (!moderator) {
    return null;
  }

  const contributedPhotos = moderator.contributedPhotos ?? "--";
  const platformCommission = moderator.platformCommission ?? "--";
  const purchasePhoto = moderator.purchasePhoto ?? 45;
  const amountEarn =
    typeof moderator.platformCommission === "number" &&
    typeof moderator.contributedPhotos === "number"
      ? `$${moderator.platformCommission * 10}`
      : "$00";

  return (
    <div className="fixed inset-0 z-100 bg-[#0d1420]/30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Moderator details"
        className="border-line-weaker absolute right-0 bottom-0 flex h-[80vh] w-full max-w-105 flex-col overflow-hidden rounded-lg border-t border-l bg-white shadow-[-18px_0_40px_rgba(15,23,42,0.14)] sm:max-w-140"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-line-weaker flex items-center justify-between border-b bg-white px-4.5 py-3">
          <div className="text-text-strong flex items-center gap-2">
            <button
              type="button"
              aria-label="Close moderator details"
              onClick={onClose}
              className="hover:bg-fill-hover inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors"
            >
              <ChevronsRight size={24} />
            </button>
          </div>

          <button
            type="button"
            aria-label="Edit moderator details"
            className="text-text-weak hover:bg-fill-hover hover:text-text-strong inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors"
          >
            <SquarePen size={24} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto bg-[#FAFAFA] px-6 pt-6">
          <div className="relative">
            <div className="border-line-weaker bg-fill-hover h-10 w-10 overflow-hidden rounded-full border">
              <Image
                src={moderator.photo}
                alt={`${moderator.name} thumbnail`}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <ModeratorDetailRow label="Name" value={moderator.name} />
            <ModeratorDetailRow label="Email" value={moderator.email} />
            <ModeratorDetailRow label="Phone Number" value={moderator.phone} />
            <ModeratorDetailRow label="Role" value={moderator.role} />
            <ModeratorDetailRow label="Contribute Photo" value={contributedPhotos} />
            <ModeratorDetailRow
              label="Plan"
              value={
                <InlineBadge className={planClassNameMap[moderator.plan]}>
                  {moderator.plan}
                </InlineBadge>
              }
            />
            <ModeratorDetailRow label="Platform Commission Fee" value={platformCommission} />
            <ModeratorDetailRow label="Purchase Photo" value={purchasePhoto} />
            <ModeratorDetailRow label="Amount Earn" value={amountEarn} />
            <ModeratorDetailRow
              label="Status"
              value={
                <InlineBadge className={statusClassNameMap[moderator.status]}>
                  {moderator.status === "Active" ? "✓ " : "✕ "}
                  {moderator.status}
                </InlineBadge>
              }
            />
            <ModeratorDetailRow
              label="Photos"
              value={
                <div className="flex items-center gap-3">
                  {previewPhotoSources.map((photoSrc, index) => (
                    <div
                      key={`${photoSrc}-${index}`}
                      className="border-line-weaker bg-fill-hover h-10 w-14 overflow-hidden rounded-xs border"
                    >
                      <Image
                        src={photoSrc}
                        alt={`Submitted photo ${index + 1}`}
                        width={56}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  <span className="bg-brand-default inline-flex h-11 w-11 items-center justify-center rounded-full text-xs font-medium text-white">
                    24+
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
