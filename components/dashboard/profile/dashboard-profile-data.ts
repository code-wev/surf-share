import type {
  DashboardProfileDefaults,
  PasswordField,
} from "@/components/dashboard/profile/dashboard-profile-types";

export const dashboardProfileDefaults: DashboardProfileDefaults = {
  fullName: "Makibul Hossain Tamim",
  country: "Bangladesh",
  phone: "714-242-888",
  email: "info@vividstaffing.com",
  address: "The Mill Suite, Hardmans Business Centre New Hey Hall Road, Rawtenstall, BB4 6HH",
};

export const dashboardPasswordFields: PasswordField[] = [
  { label: "Password", placeholder: "Type your password" },
  { label: "New Password", placeholder: "Type new your password" },
  { label: "Confirm New Password", placeholder: "Confirm your password" },
];
