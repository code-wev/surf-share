import { ArrowDownUp, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { RefObject } from "react";

import type { FilterOption } from "@/components/dashboard/user-management/user-management-types";

type UserManagementHeaderProps = {
  isFilterOpen: boolean;
  activeFilter: FilterOption;
  filterOptions: ReadonlyArray<FilterOption>;
  filterDropdownRef: RefObject<HTMLDivElement | null>;
  onToggleFilter: () => void;
  onSelectFilter: (option: FilterOption) => void;
};

export default function UserManagementHeader({
  isFilterOpen,
  activeFilter,
  filterOptions,
  filterDropdownRef,
  onToggleFilter,
  onSelectFilter,
}: UserManagementHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
      <h1 className="inline-flex border-b border-brand-default pb-1 text-base font-medium text-brand-default sm:text-lg">
        User Management
      </h1>

      <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
        <button
          type="button"
          onClick={onToggleFilter}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-sm border border-line-weaker bg-surface-muted-100 px-3 text-xs font-medium text-brand-default sm:w-auto sm:justify-start"
        >
          Filter &amp; Sort
          <SlidersHorizontal size={14} />
        </button>

        {isFilterOpen ? (
          <div className="absolute top-11 right-0 left-0 z-20 overflow-hidden rounded-sm border border-line-weaker bg-surface-muted-100 shadow-[0_10px_28px_rgba(15,23,42,0.12)] sm:left-auto sm:w-50">
            <div className="flex items-center justify-between border-b border-line-weaker px-3 py-2">
              <p className="text-xs font-medium text-brand-default">Filter &amp; Sort</p>
              <ArrowDownUp size={12} className="text-brand-default" />
            </div>

            <ul className="py-1.5">
              {filterOptions.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => onSelectFilter(option)}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs ${
                      activeFilter === option
                        ? "bg-fill-disable text-text-strong"
                        : "text-text-weak hover:bg-fill-hover"
                    }`}
                  >
                    {option}
                    {activeFilter === option ? <ChevronDown size={12} /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
