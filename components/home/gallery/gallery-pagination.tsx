"use client";

type GalleryPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(totalPages: number) {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  return [1, 2, 3, 4];
}

export default function GalleryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: GalleryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(totalPages);

  return (
    <section className="px-4 pb-10 sm:px-6 md:mx-12.5 md:px-0 md:pb-25">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-(--color-text-weak)">
        <button
          type="button"
          className="rounded-md px-3 py-2 disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={
              currentPage === pageNumber
                ? "rounded-md border border-(--color-line-weaker) bg-(--color-surface-muted-100) px-4 py-2 text-(--color-text-strong)"
                : "rounded-md px-4 py-2 text-(--color-text-strong)"
            }
          >
            {pageNumber}
          </button>
        ))}

        {totalPages > 4 ? <span className="px-2">...</span> : null}

        <button
          type="button"
          className="rounded-md px-3 py-2 disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
