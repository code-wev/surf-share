import Image from "next/image";
import { X } from "lucide-react";

import type { UserPlan, UserRow, UserStatus } from "@/components/dashboard/user-management/user-management-types";

type UserDetailsModalProps = {
  user: UserRow | null;
  planClassNameMap: Record<UserPlan, string>;
  statusClassNameMap: Record<UserStatus, string>;
  onClose: () => void;
};

type UserDetailFieldProps = {
  label: string;
  value: string;
  className?: string;
};

function UserDetailField({ label, value, className }: UserDetailFieldProps) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-text-strong sm:mb-2 sm:text-base">{label}</span>
      <input
        readOnly
        value={value}
        className="border-line-weaker bg-surface-muted-100 w-full rounded-md border px-3 py-2.5 text-xs text-text-weak sm:text-sm"
      />
    </label>
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

  const userDetails = {
    fullName: user.name,
    country: user.country ?? "Australia",
    phone: user.phone,
    email: user.email,
    address:
      user.address ??
      "The Mill Suite, Hardmans Business Centre New Hey Hall Road, Rawtenstall, BB4 6HH",
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-3 sm:p-4 md:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="User details"
        className="relative w-full max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-xl border border-line-weaker bg-white shadow-[0_20px_50px_rgba(15,23,42,0.25)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-180 lg:max-w-215 xl:max-w-240"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line-weaker px-4 py-3 sm:px-5 sm:py-3.5">
          <h2 className="text-base font-semibold text-text-brand-strong sm:text-xl">User Details</h2>

          <button
            type="button"
            aria-label="Close user details"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line-weaker text-text-strong hover:bg-fill-hover"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto px-4 py-4 sm:max-h-[calc(100dvh-7rem)] sm:px-5 sm:py-5">
          <section className="flex h-full flex-col">
            <div className="mt-1 flex flex-col items-center sm:mt-2 sm:items-start">
              <div className="relative">
                <div className="border-line-weaker bg-fill-hover h-20 w-20 overflow-hidden rounded-full border sm:h-25 sm:w-25">
                  <Image
                    src={user.photo}
                    alt={`${user.name} profile photo`}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <p className="text-text-strong mt-3 text-center text-base font-medium sm:mt-4 sm:text-left sm:text-lg">
                {userDetails.fullName}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex rounded-sm bg-[#F3F4F6] px-2 py-0.5 text-xs text-[#6B7280]">
                  {user.role}
                </span>
                <span
                  className={`inline-flex rounded-sm px-2 py-0.5 text-xs ${planClassNameMap[user.plan]}`}
                >
                  {user.plan}
                </span>
                <span
                  className={`inline-flex rounded-sm px-2 py-0.5 text-xs ${statusClassNameMap[user.status]}`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:gap-4 md:mt-8 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
              <UserDetailField label="Full name" value={userDetails.fullName} />
              <UserDetailField label="Country Name" value={userDetails.country} />
              <UserDetailField label="Phone Number" value={userDetails.phone} />
              <UserDetailField label="Email Address" value={userDetails.email} />
              <UserDetailField
                label="Address"
                value={userDetails.address}
                className="md:col-span-2"
              />
            </div>

            <div className="mt-5 border-t border-line-weaker pt-4 sm:mt-6 sm:justify-end sm:border-t-0 sm:pt-0">
              <button
                type="button"
                onClick={onClose}
                className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-10 w-full items-center justify-center rounded-sm px-4 text-sm font-medium transition-colors sm:w-auto"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
