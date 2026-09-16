"use client";

import Pagination from "@/components/shared/pagination";

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
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      className="mt-5 sm:mt-6"
    />
  );
}
