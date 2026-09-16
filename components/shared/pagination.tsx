"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  scrollToTop?: boolean;
};

export function getPaginationItems(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Near the beginning: 1, 2, 3, 4, ..., totalPages
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
  }

  // Near the end: 1, ..., totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // In the middle: 1, ..., currentPage - 1, currentPage, currentPage + 1, ..., totalPages
  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  scrollToTop = true,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(currentPage, totalPages);

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
    if (scrollToTop && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`text-text-weak mt-6 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:gap-2 ${className}`}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="inline-flex h-8 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-45 cursor-pointer transition-colors hover:text-text-strong disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {items.map((item, idx) => {
        if (typeof item === "string") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex h-8 w-6 items-center justify-center text-text-weaker select-none"
            >
              ...
            </span>
          );
        }

        const isCurrent = currentPage === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => handlePageClick(item)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-sm cursor-pointer transition-colors ${
              isCurrent
                ? "bg-[#EEF2F7] text-text-strong font-semibold"
                : "text-text-weak hover:bg-fill-hover"
            }`}
            aria-current={isCurrent ? "page" : undefined}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="inline-flex h-8 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-45 cursor-pointer transition-colors hover:text-text-strong disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
