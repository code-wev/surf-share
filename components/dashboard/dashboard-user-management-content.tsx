"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const UserDetailsModal = dynamic(
  () => import("@/components/dashboard/user-management/user-details-modal"),
  { ssr: false },
);

import UserManagementHeader from "@/components/dashboard/user-management/user-management-header";
import UserManagementPagination from "@/components/dashboard/user-management/user-management-pagination";
import UserManagementTable from "@/components/dashboard/user-management/user-management-table";
import {
  planClassNameMap,
  statusClassNameMap,
  filterOptions,
} from "@/components/dashboard/user-management/user-management-data";
import type {
  FilterOption,
  UserRow,
  UserRole,
  UserPlan,
} from "@/components/dashboard/user-management/user-management-types";
import { getUsers } from "@/src/actions/user.action";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { useDeleteUserMutation } from "@/hooks/api/useUsers";

type ApiUser = {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string | null;
  phoneNumber?: string | null;
  role: string;
  status?: string | null;
  photoCount?: number | string | null;
  platformCommission?: number | string | null;
  purchasePhoto?: number | string | null;
  subscriptionTier?: string | null;
  countryName?: string | null;
  address?: string | null;
  promotionEmail: boolean;
  manualBankDetails?: string | null;
  paypalEmail?: string | null;
  paypalConnected?: boolean | null;
};

export default function DashboardUserManagementContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All Users");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);
  const deleteMutation = useDeleteUserMutation();

  // Fetch users from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", activeFilter, currentPage],
    queryFn: async () => {
      return getUsers({
        role: activeFilter,
        page: currentPage,
        limit: 10,
      });
    },
  });

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!filterDropdownRef.current) {
        return;
      }

      if (!filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedUserId(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedUserId]);

  const mapRoleToFrontend = (backendRole: string): UserRole => {
    if (backendRole === "SURFER") return "Surfer";
    if (backendRole === "PHOTOGRAPHER") return "Photographer";
    return "Surfer";
  };

  const mapPlatformCommissionByPlan = (subscriptionTier?: string | null) => {
    if (subscriptionTier === "BRONZE") return "30%";
    if (subscriptionTier === "SILVER") return "20%";
    if (subscriptionTier === "GOLD") return "10%";
    if (subscriptionTier === "GOLD_PLUS") return "99%";
    return "-";
  };

  const mapSubscriptionTierToFrontend = (subscriptionTier?: string | null): UserPlan => {
    if (subscriptionTier === "BRONZE") return "Bronze";
    if (subscriptionTier === "SILVER") return "Silver";
    if (subscriptionTier === "GOLD") return "Gold";
    if (subscriptionTier === "GOLD_PLUS") return "Gold Plus";
    return "-";
  };

  const mappedRows: UserRow[] = useMemo(() => {
    return (
      data?.data?.map((user: ApiUser) => ({
        id: user.id,
        photo: user.profileImageUrl ? getAbsoluteImageUrl(user.profileImageUrl as string) : "/home/latest/latest1.jpg",
        name: user.name,
        email: user.email,
        phone: user.phoneNumber || "-",
        role: mapRoleToFrontend(user.role),
        contributedPhotos: user.photoCount ?? "-",
        plan: mapSubscriptionTierToFrontend(user.subscriptionTier),
        platformCommission: mapPlatformCommissionByPlan(user.subscriptionTier),
        purchasePhoto: user.purchasePhoto ?? "-",
        status: user.status === "ACTIVE" ? "Active" : "Suspended",
        country: user.countryName ?? undefined,
        address: user.address ?? undefined,
        promotionEmail: user.promotionEmail,
      })) || []
    );
  }, [data?.data]);

  const totalPages = data?.meta?.totalPages || 1;

  return (
    <section className="px-3 pb-5 [font-family:var(--font-sf-pro)] sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <div className="mx-auto flex w-full max-w-400 flex-col">
        <UserManagementHeader
          isFilterOpen={isFilterOpen}
          activeFilter={activeFilter}
          filterOptions={filterOptions}
          filterDropdownRef={filterDropdownRef}
          onToggleFilter={() => setIsFilterOpen((previous) => !previous)}
          onSelectFilter={(option) => {
            setActiveFilter(option);
            setCurrentPage(1); // Reset page on filter change
            setIsFilterOpen(false);
          }}
        />

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-text-weaker">Loading users...</p>
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-danger-strong">Failed to load users.</p>
          </div>
        ) : (
          <UserManagementTable
            rows={mappedRows}
            planClassNameMap={planClassNameMap}
            statusClassNameMap={statusClassNameMap}
            onViewDetails={(user) => setSelectedUserId(user.id)}
            onDelete={(user) => setUserToDelete(user)}
          />
        )}

        {totalPages > 1 && (
          <UserManagementPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {selectedUserId ? (
          <UserDetailsModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
        ) : null}

        {userToDelete ? (
          <div className="fixed inset-0 z-1200 flex items-center justify-center bg-black/45 p-4" onClick={() => setUserToDelete(null)}>
            <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-[0_26px_70px_rgba(15,23,42,0.25)]" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-text-strong">Delete User</h3>
              <p className="mt-2 text-sm text-text-weak">
                Are you sure you want to delete <strong>{userToDelete.name}</strong>? This will permanently remove their account.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  disabled={deleteMutation.isPending}
                  className="rounded-sm border border-line-weaker px-4 py-2 text-sm font-medium text-text-strong transition-colors hover:bg-fill-hover disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteMutation.mutate(userToDelete.id, {
                      onSuccess: () => setUserToDelete(null)
                    });
                  }}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-sm bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
