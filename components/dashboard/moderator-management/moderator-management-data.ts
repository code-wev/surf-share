import type { FilterOption, ModeratorStatus } from "@/components/dashboard/moderator-management/moderator-management-types";

export const filterOptions: ReadonlyArray<FilterOption> = ["Recently Added", "View From Last"];

export const statusClassNameMap: Record<ModeratorStatus, string> = {
  Active: "bg-[#EDFDF3] text-[#12B76A]",
  Suspended: "bg-[#FEF3F2] text-[#F04438]",
};
