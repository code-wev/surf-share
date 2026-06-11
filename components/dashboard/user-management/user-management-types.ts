export type UserRole = "Surfer" | "Photographer" | string;
export type UserPlan = "Gold Plus" | "Gold" | "Silver" | "Bronze" | "-";
export type UserStatus = "Active" | "Suspended";

export type UserRow = {
  id: string;
  photo: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  contributedPhotos: number | null | string;
  plan: UserPlan;
  platformCommission: number | null | string;
  showCommissionSortIcon?: boolean;
  purchasePhoto: number | null | string;
  status: UserStatus;
  country?: string;
  address?: string;
  promotionEmail: boolean;
};

export type FilterOption = "All Users" | "Surfers" | "Photographers" | string;
