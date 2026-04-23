import Image from "next/image";
import { ChevronsRight, SquarePen } from "lucide-react";

import type {
  ModeratorRow,
  ModeratorStatus,
} from "@/components/dashboard/moderator-management/moderator-management-types";

type ModeratorDetailsModalProps = {
  moderator: ModeratorRow | null;
  statusClassNameMap: Record<ModeratorStatus, string>;
  onClose: () => void;
};

type ModeratorDetailRowProps = {
  label: string;
  value: React.ReactNode;
};

function ModeratorDetailRow({ label, value }: ModeratorDetailRowProps) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-8 gap-y-1 py-1 [font-family:var(--font-sf-pro)] text-xs leading-tight sm:grid-cols-[140px_minmax(0,1fr)] sm:text-sm">
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
  statusClassNameMap,
  onClose,
}: ModeratorDetailsModalProps) {
  if (!moderator) return null;

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

          <div className="mt-6 space-y-3 pb-8">
            <ModeratorDetailRow label="Name" value={moderator.name} />
            <ModeratorDetailRow label="Email" value={moderator.email} />
            <ModeratorDetailRow label="Phone Number" value={moderator.phone} />
            <ModeratorDetailRow label="Assigned Date" value={moderator.assignedDate} />
            <ModeratorDetailRow 
              label="Assigned Permissions" 
              value={
                <div className="flex flex-wrap gap-1">
                  {moderator.assignedPermissions.map((perm) => (
                    <span key={perm} className="inline-flex rounded-sm bg-[#F3F4F6] px-2 py-1 text-[11px] text-[#6B7280]">
                      {perm}
                    </span>
                  ))}
                </div>
              } 
            />
            <ModeratorDetailRow
              label="Status"
              value={
                <InlineBadge className={statusClassNameMap[moderator.status]}>
                  {moderator.status === "Active" ? "✓ " : "✕ "}
                  {moderator.status}
                </InlineBadge>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}