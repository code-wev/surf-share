import type { ReactNode } from "react";

import Navbar from "@/components/shared/navbar";

type DashboardGroupLayoutProps = {
  children: ReactNode;
};

export default function DashboardGroupLayout({ children }: DashboardGroupLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="h-[calc(100vh-68px)] overflow-hidden bg-white">{children}</main>
    </div>
  );
}