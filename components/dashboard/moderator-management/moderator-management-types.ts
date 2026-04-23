export type ModeratorStatus = "Active" | "Suspended";
export type AssignedPermission = "Photo Approval" | "Location Management";

export type ModeratorRow = {
  id: number;
  photo: string;
  name: string;
  email: string;
  phone: string;
  assignedDate: string;
  assignedPermissions: AssignedPermission[];
  status: ModeratorStatus;
};

export type FilterOption = "Recently Added" | "View From Last";