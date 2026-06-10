import type { FilterOption, UserPlan, UserStatus } from "@/components/dashboard/user-management/user-management-types";

export const filterOptions: ReadonlyArray<FilterOption> = ["All Users", "Surfers", "Photographers"];

export const planClassNameMap: Record<UserPlan, string> = {
  "Gold Plus": "bg-[#4B0082] text-white", // Deep rich purple to signify top tier
  Gold: "bg-[#FBF5DD] text-[#B58212]",
  Silver: "bg-[#EEF2F6] text-[#64748B]",
  Bronze: "bg-[#FCEFEF] text-[#B07A7A]",
  "-": "bg-surface-muted-100 text-text-weak",
};

export const statusClassNameMap: Record<UserStatus, string> = {
  Active: "bg-[#EDFDF3] text-[#12B76A]",
  Suspended: "bg-[#FEF3F2] text-[#F04438]",
};
