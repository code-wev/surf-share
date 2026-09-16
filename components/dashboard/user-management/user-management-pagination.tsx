"use client";

import Pagination from "@/components/shared/pagination";

type UserManagementPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function UserManagementPagination({
  currentPage,
  totalPages,
  onPageChange,
}: UserManagementPaginationProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      className="mt-5 sm:mt-6"
    />
  );
}
