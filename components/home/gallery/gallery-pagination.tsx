"use client";

type GalleryPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPaginationItems(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Near the beginning: 1, 2, 3, 4, ..., totalPages
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis-end", totalPages];
  }

  // Near the end: 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis-start", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // In the middle: 1, ..., current-1, current, current+1, ..., totalPages
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

export default function GalleryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: GalleryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const paginationItems = getPaginationItems(currentPage, totalPages);

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 pb-10 sm:px-6 md:mx-12.5 md:px-0 md:pb-25">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-(--color-text-weak)">
        <button
          type="button"
          className="rounded-md px-3 py-2 transition-colors hover:text-(--color-text-strong) disabled:opacity-40 disabled:hover:text-inherit cursor-pointer disabled:cursor-not-allowed"
          disabled={currentPage <= 1}
          onClick={() => handlePageClick(currentPage - 1)}
        >
          Previous
        </button>

        {paginationItems.map((item) => {
          if (typeof item === "string") {
            return (
              <span key={item} className="px-2 select-none text-(--color-text-weaker)">
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
              aria-current={isCurrent ? "page" : undefined}
              className={
                isCurrent
                  ? "rounded-md border border-(--color-line-weaker) bg-(--color-surface-muted-100) px-4 py-2 font-semibold text-(--color-text-strong) shadow-xs cursor-default"
                  : "rounded-md px-4 py-2 text-(--color-text-strong) hover:bg-(--color-surface-muted-100) transition-colors cursor-pointer"
              }
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          className="rounded-md px-3 py-2 transition-colors hover:text-(--color-text-strong) disabled:opacity-40 disabled:hover:text-inherit cursor-pointer disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageClick(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
