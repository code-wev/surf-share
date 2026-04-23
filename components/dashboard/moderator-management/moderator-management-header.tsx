import { ArrowDownUp, ChevronDown, Plus, SlidersHorizontal } from "lucide-react";
import type { RefObject } from "react";

import type { FilterOption } from "@/components/dashboard/moderator-management/moderator-management-types";

type ModeratorManagementHeaderProps = {
  isFilterOpen: boolean;
  activeFilter: FilterOption;
  filterOptions: ReadonlyArray<FilterOption>;
  filterDropdownRef: RefObject<HTMLDivElement | null>;
  onToggleFilter: () => void;
  onSelectFilter: (option: FilterOption) => void;
  onOpenAddModerator: () => void;
};

export default function ModeratorManagementHeader({
  isFilterOpen,
  activeFilter,
  filterOptions,
  filterDropdownRef,
  onToggleFilter,
  onSelectFilter,
  onOpenAddModerator,
}: ModeratorManagementHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
      <h1 className="border-brand-default text-brand-default inline-flex border-b pb-1 text-base font-medium sm:text-lg">
        Moderator Management
      </h1>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
          <button
            type="button"
            onClick={onToggleFilter}
            className="border-line-weaker bg-surface-muted-100 text-brand-default inline-flex h-9 w-full items-center justify-center gap-2 rounded-sm border px-3 text-xs font-medium sm:w-auto sm:justify-start"
          >
            Filter &amp; Sort
            <SlidersHorizontal size={14} />
          </button>

          {isFilterOpen ? (
            <div className="border-line-weaker bg-surface-muted-100 absolute top-11 right-0 left-0 z-20 overflow-hidden rounded-sm border shadow-[0_10px_28px_rgba(15,23,42,0.12)] sm:left-auto sm:w-50">
              <div className="border-line-weaker flex items-center justify-between border-b px-3 py-2">
                <p className="text-brand-default text-xs font-medium">Filter &amp; Sort</p>
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

        <button
          type="button"
          onClick={onOpenAddModerator}
          className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-9 w-full items-center justify-center gap-2 rounded-sm px-3 text-xs font-medium transition-colors sm:w-auto"
        >
          Add Moderator
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
