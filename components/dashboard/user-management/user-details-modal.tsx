import Image from "next/image";
import { ChevronsLeft, Expand, PencilLine } from "lucide-react";

import type {
  UserPlan,
  UserRow,
  UserStatus,
} from "@/components/dashboard/user-management/user-management-types";

type UserDetailsModalProps = {
  user: UserRow | null;
  planClassNameMap: Record<UserPlan, string>;
  statusClassNameMap: Record<UserStatus, string>;
  onClose: () => void;
};

type UserDetailRowProps = {
  label: string;
  value: React.ReactNode;
};

const previewPhotoSources = [
  "/home/latest/latest1.jpg",
  "/home/latest/latest2.jpg",
  "/home/latest/latest3.jpg",
  "/home/latest/latest4.jpg",
] as const;

function UserDetailRow({ label, value }: UserDetailRowProps) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-x-4 gap-y-1 text-[10px] leading-tight sm:grid-cols-[104px_minmax(0,1fr)] sm:text-[11px]">
      <span className="text-text-strong font-medium">{label}</span>
      <div className="min-w-0 text-text-weak">{value}</div>
    </div>
  );
}

function InlineBadge({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] ${className}`}>
      {children}
    </span>
  );
}

export default function UserDetailsModal({
  user,
  planClassNameMap,
  statusClassNameMap,
  onClose,
}: UserDetailsModalProps) {
  if (!user) {
    return null;
  }

  const contributedPhotos = user.contributedPhotos ?? "--";
  const platformCommission = user.platformCommission ?? "--";
  const purchasePhoto = user.purchasePhoto ?? 45;
  const amountEarn =
    typeof user.platformCommission === "number" && typeof user.contributedPhotos === "number"
      ? `$${user.platformCommission * 10}`
      : "$00";

  return (
    <div className="fixed inset-0 z-100 bg-[#0d1420]/30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="User details"
        className="absolute top-0 right-0 flex h-full w-full max-w-[326px] flex-col overflow-hidden rounded-l-md border-l border-line-weaker bg-white shadow-[-18px_0_40px_rgba(15,23,42,0.14)] sm:max-w-[348px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2 text-text-strong">
            <button
              type="button"
              aria-label="Close user details"
              onClick={onClose}
              className="inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors hover:bg-fill-hover"
            >
              <ChevronsLeft size={12} />
            </button>
            <button
              type="button"
              aria-label="Expand user details"
              className="inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors hover:bg-fill-hover"
            >
              <Expand size={11} />
            </button>
          </div>

          <button
            type="button"
            aria-label="Edit user details"
            className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-text-weak transition-colors hover:bg-fill-hover hover:text-text-strong"
          >
            <PencilLine size={12} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-5 sm:px-4">
          <div className="relative pt-3 pb-4">
            <div className="flex items-start justify-between">
              <div className="border-line-weaker mt-6 h-8 w-8 overflow-hidden rounded-full border bg-fill-hover">
                <Image
                  src={user.photo}
                  alt={`${user.name} thumbnail`}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <UserDetailRow label="Name" value={user.name} />
            <UserDetailRow label="Email" value={user.email} />
            <UserDetailRow label="Phone Number" value={user.phone} />
            <UserDetailRow label="Role" value={user.role} />
            <UserDetailRow label="Contribute Photo" value={contributedPhotos} />
            <UserDetailRow
              label="Plan"
              value={<InlineBadge className={planClassNameMap[user.plan]}>{user.plan}</InlineBadge>}
            />
            <UserDetailRow label="Platform Commission Fee" value={platformCommission} />
            <UserDetailRow label="Purchase Photo" value={purchasePhoto} />
            <UserDetailRow label="Amount Earn" value={amountEarn} />
            <UserDetailRow
              label="Status"
              value={
                <InlineBadge className={statusClassNameMap[user.status]}>
                  {user.status === "Active" ? "✓ " : "✕ "}
                  {user.status}
                </InlineBadge>
              }
            />
            <UserDetailRow
              label="Photos"
              value={
                <div className="flex items-center gap-1.5">
                  {previewPhotoSources.map((photoSrc, index) => (
                    <div
                      key={`${photoSrc}-${index}`}
                      className="border-line-weaker h-6 w-9 overflow-hidden rounded-[2px] border bg-fill-hover"
                    >
                      <Image
                        src={photoSrc}
                        alt={`Submitted photo ${index + 1}`}
                        width={36}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-default text-[10px] font-medium text-white">
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
