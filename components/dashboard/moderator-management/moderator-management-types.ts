export type ModeratorStatus = "Active" | "Suspended";
export type AssignedPermission = "Approve Photo" | "Add Location" | "All Access";

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
