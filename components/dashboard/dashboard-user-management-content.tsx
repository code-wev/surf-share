"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import UserDetailsModal from "@/components/dashboard/user-management/user-details-modal";
import UserManagementHeader from "@/components/dashboard/user-management/user-management-header";
import UserManagementPagination from "@/components/dashboard/user-management/user-management-pagination";
import UserManagementTable from "@/components/dashboard/user-management/user-management-table";
import {
  filterOptions,
  planClassNameMap,
  statusClassNameMap,
  userRows,
} from "@/components/dashboard/user-management/user-management-data";
import type {
  FilterOption,
  UserRow,
} from "@/components/dashboard/user-management/user-management-types";

export default function DashboardUserManagementContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All Users");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

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

  const filteredRows = useMemo(() => {
    if (activeFilter === "Contributors") {
      return userRows.filter((row) => row.role === "Contributor");
    }

    if (activeFilter === "Users") {
      return userRows.filter((row) => row.role === "User");
    }

    return userRows;
  }, [activeFilter]);

  const totalPages = 4;

  return (
    <section className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5 [font-family:var(--font-sf-pro)]">
      <div className="mx-auto flex w-full max-w-400 flex-col">
        <UserManagementHeader
          isFilterOpen={isFilterOpen}
          activeFilter={activeFilter}
          filterOptions={filterOptions}
          filterDropdownRef={filterDropdownRef}
          onToggleFilter={() => setIsFilterOpen((previous) => !previous)}
          onSelectFilter={(option) => {
            setActiveFilter(option);
            setIsFilterOpen(false);
          }}
        />

        <UserManagementTable
          rows={filteredRows}
          planClassNameMap={planClassNameMap}
          statusClassNameMap={statusClassNameMap}
          onViewDetails={(user) => setSelectedUser(user)}
        />

        <UserManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <UserDetailsModal
          user={selectedUser}
          planClassNameMap={planClassNameMap}
          statusClassNameMap={statusClassNameMap}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </section>
  );
}