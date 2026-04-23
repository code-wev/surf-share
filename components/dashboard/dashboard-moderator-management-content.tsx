"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ModeratorDetailsModal from "@/components/dashboard/moderator-management/moderator-details-modal";
import ModeratorManagementHeader from "@/components/dashboard/moderator-management/moderator-management-header";
import ModeratorManagementPagination from "@/components/dashboard/moderator-management/moderator-management-pagination";
import ModeratorManagementTable from "@/components/dashboard/moderator-management/moderator-management-table";
import {
  filterOptions,
  statusClassNameMap,
  moderatorRows,
} from "@/components/dashboard/moderator-management/moderator-management-data";
import type {
  FilterOption,
  ModeratorRow,
} from "@/components/dashboard/moderator-management/moderator-management-types";

export default function DashboardModeratorManagementContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("Recently Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModerator, setSelectedModerator] = useState<ModeratorRow | null>(null);
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
    if (!selectedModerator) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedModerator(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedModerator]);

  const filteredRows = useMemo(() => {
    if (activeFilter === "View From Last") {
      return [...moderatorRows].reverse();
    }
    return moderatorRows; // "Recently Added" defaults to original order
  }, [activeFilter]);

  const totalPages = 4;

  return (
    <section className="px-3 pb-5 [font-family:var(--font-sf-pro)] sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <div className="mx-auto flex w-full max-w-400 flex-col">
        <ModeratorManagementHeader
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

        <ModeratorManagementTable
          rows={filteredRows}
          statusClassNameMap={statusClassNameMap}
          onViewDetails={(moderator) => setSelectedModerator(moderator)}
        />

        <ModeratorManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ModeratorDetailsModal
          moderator={selectedModerator}
          statusClassNameMap={statusClassNameMap}
          onClose={() => setSelectedModerator(null)}
        />
      </div>
    </section>
  );
}