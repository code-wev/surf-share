import type { ReactNode } from "react";

import DashboardShellLayout from "@/components/dashboard/dashboard-shell-layout";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShellLayout>{children}</DashboardShellLayout>;
}