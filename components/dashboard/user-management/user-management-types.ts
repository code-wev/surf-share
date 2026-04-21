export type UserRole = "User" | "Contributor";
export type UserPlan = "Gold" | "Silver" | "Bronze";
export type UserStatus = "Active" | "Suspended";

export type UserRow = {
  id: number;
  photo: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  contributedPhotos: number | null;
  plan: UserPlan;
  platformCommission: number | null;
  showCommissionSortIcon?: boolean;
  purchasePhoto: number | null;
  status: UserStatus;
  country?: string;
  address?: string;
};

export type FilterOption = "All Users" | "Contributors" | "Users";
