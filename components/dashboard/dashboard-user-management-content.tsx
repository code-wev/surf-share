"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const UserDetailsModal = dynamic(
  () => import("@/components/dashboard/user-management/user-details-modal"),
  { ssr: false }
);

import UserManagementHeader from "@/components/dashboard/user-management/user-management-header";
import UserManagementPagination from "@/components/dashboard/user-management/user-management-pagination";
import UserManagementTable from "@/components/dashboard/user-management/user-management-table";
import { apiClient } from "@/lib/api/client";
import {
  planClassNameMap,
  statusClassNameMap,
  filterOptions,
} from "@/components/dashboard/user-management/user-management-data";
import type {
  FilterOption,
  UserRow,
  UserRole,
} from "@/components/dashboard/user-management/user-management-types";

type ApiUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  countryName?: string;
  address?: string;
};

export default function DashboardUserManagementContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All Users");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch users from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", activeFilter, currentPage],
    queryFn: async () => {
      const response = await apiClient.get("/users", {
        params: {
          role: activeFilter,
          page: currentPage,
          limit: 10,
        },
      });
      return response.data;
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
    if (!selectedUser) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedUser(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedUser]);

  const mapRoleToFrontend = (backendRole: string): UserRole => {
    if (backendRole === "SURFER") return "Surfer";
    if (backendRole === "PHOTOGRAPHER") return "Photographer";
    return "Surfer";
  };

  const mappedRows: UserRow[] = useMemo(() => {
    return data?.data?.map((user: ApiUser) => ({
      id: user.id,
      photo: "/home/latest/latest15.jpg", // Default photo as requested
      name: user.name,
      email: user.email,
      phone: user.phoneNumber || "-",
      role: mapRoleToFrontend(user.role),
      contributedPhotos: "-", // Specific requested defaults
      plan: "-",
      platformCommission: "-",
      purchasePhoto: "-",
      status: "Active", // Default
      country: user.countryName,
      address: user.address,
    })) || [];
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
            onViewDetails={(user) => setSelectedUser(user)}
          />
        )}

        {totalPages > 1 && (
          <UserManagementPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {selectedUser ? (
          <UserDetailsModal
            user={selectedUser}
            planClassNameMap={planClassNameMap}
            statusClassNameMap={statusClassNameMap}
            onClose={() => setSelectedUser(null)}
          />
        ) : null}
      </div>
    </section>
  );
}
