import Image from "next/image";
import { ChevronsRight, SquarePen, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserById, getUserPhotos } from "@/src/actions/user.action";

import type {
  UserPlan,
  UserStatus,
} from "@/components/dashboard/user-management/user-management-types";

type UserDetailsModalProps = {
  userId: string | null;
  planClassNameMap: Record<UserPlan, string>;
  statusClassNameMap: Record<UserStatus, string>;
  onClose: () => void;
};

type UserDetailRowProps = {
  label: string;
  value: React.ReactNode;
};

function UserDetailRow({ label, value }: UserDetailRowProps) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-x-12 gap-y-1 text-xs leading-tight sm:grid-cols-[104px_minmax(0,1fr)] sm:text-sm [font-family:var(--font-sf-pro)] py-1">
      <span className="text-text-strong font-medium">{label}</span>
      <div className="min-w-0 text-text-weak">{value}</div>
    </div>
  );
}

export default function UserDetailsModal({
  userId,
  planClassNameMap,
  statusClassNameMap,
  onClose,
}: UserDetailsModalProps) {
  const { data: userResponse, isLoading, isError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => (userId ? getUserById(userId) : Promise.reject("No user ID")),
    enabled: !!userId,
  });

  const { data: photosData, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ["user-photos", userId],
    queryFn: () => (userId ? getUserPhotos(userId, 100) : Promise.reject("No user ID")),
    enabled: !!userId,
  });

  const user = userResponse?.data;
  const photos = photosData?.data ?? [];
  const displayPhotos = photos.slice(0, 4);
  const remainingPhotos = Math.max(0, photos.length - 4);

  if (!userId) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 bg-[#0d1420]/30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="User details"
        className="absolute right-0 bottom-0 flex h-[80vh] w-full max-w-105 flex-col overflow-hidden rounded-lg border-t border-l border-line-weaker bg-white shadow-[-18px_0_40px_rgba(15,23,42,0.14)] sm:max-w-140"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4.5 py-3 bg-white border-b border-line-weaker">
          <div className="flex items-center gap-2 text-text-strong">
            <button
              type="button"
              aria-label="Close user details"
              onClick={onClose}
              className="inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors hover:bg-fill-hover"
            >
              <ChevronsRight size={24} />
            </button>
          </div>

          <button
            type="button"
            aria-label="Edit user details"
            className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-text-weak transition-colors hover:bg-fill-hover hover:text-text-strong"
          >
            <SquarePen size={24} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto pt-6 px-6 bg-[#FAFAFA]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-text-weak" />
            </div>
          ) : isError || !user ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-danger-strong">Failed to load user details.</p>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="border-line-weaker h-10 w-10 overflow-hidden rounded-full border bg-fill-hover">
                  <Image
                    src="/home/latest/latest15.jpg"
                    alt={`${user.name} thumbnail`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <UserDetailRow label="Name" value={user.name} />
                <UserDetailRow label="Email" value={user.email} />
                <UserDetailRow label="Phone Number" value={user.phoneNumber ?? "--"} />
                <UserDetailRow label="Role" value={user.role} />
                <UserDetailRow label="Country" value={user.countryName ?? "--"} />
                <UserDetailRow label="Address" value={user.address ?? "--"} />
                <UserDetailRow
                  label="Photos"
                  value={
                    isLoadingPhotos ? (
                      <Loader2 className="animate-spin text-text-weak" />
                    ) : (
                      <div className="flex items-center gap-3">
                        {displayPhotos.map((photo, index) => (
                          <div
                            key={index}
                            className="border-line-weaker h-10 w-14 overflow-hidden rounded-xs border bg-fill-hover"
                          >
                            <Image
                              src={photo.imageUrl}
                              alt={`Submitted photo ${index + 1}`}
                              width={56}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                        {remainingPhotos > 0 && (
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-default text-xs font-medium text-white">
                            {remainingPhotos}+
                          </span>
                        )}
                      </div>
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
