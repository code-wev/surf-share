export type ModeratorRole = "User" | "Contributor";
export type ModeratorPlan = "Gold" | "Silver" | "Bronze";
export type ModeratorStatus = "Active" | "Suspended";

export type ModeratorRow = {
  id: number;
  photo: string;
  name: string;
  email: string;
  phone: string;
  role: ModeratorRole;
  contributedPhotos: number | null;
  plan: ModeratorPlan;
  platformCommission: number | null;
  showCommissionSortIcon?: boolean;
  purchasePhoto: number | null;
  status: ModeratorStatus;
  country?: string;
  address?: string;
};

export type FilterOption = "All Users" | "Contributors" | "Users";
