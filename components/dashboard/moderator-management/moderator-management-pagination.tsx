import { ChevronLeft, ChevronRight } from "lucide-react";

type ModeratorManagementPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function ModeratorManagementPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ModeratorManagementPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="text-text-weak mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:mt-6 sm:gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex h-8 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-45"
      >
        <ChevronLeft size={12} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-sm ${
            currentPage === page
              ? "text-text-strong bg-[#EEF2F7]"
              : "text-text-weak hover:bg-fill-hover"
          }`}
        >
          {page}
        </button>
      ))}

      <span className="hidden px-1 sm:inline">...</span>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex h-8 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-45"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={12} />
      </button>
    </div>
  );
}
