"use client";

import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { cn } from "@/lib/utils";

type DashboardShellLayoutProps = {
  children: ReactNode;
};

export default function DashboardShellLayout({ children }: DashboardShellLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  return (
    <section className="h-full bg-white">
      <div className="mx-auto flex h-full max-w-470 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm bg-surface-muted-100">
          <div className="flex items-center justify-between border-b border-line-weaker px-4 py-3 lg:hidden">
            <p className="text-sm font-medium text-text-strong">Dashboard Menu</p>
            <button
              type="button"
              aria-label="Open dashboard menu"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line-weaker text-text-strong transition-colors hover:bg-fill-hover"
            >
              <Menu size={18} />
            </button>
          </div>

          <div
            className={cn(
              "grid min-h-0 flex-1 grid-cols-1",
              isDesktopSidebarCollapsed
                ? "lg:grid-cols-[88px_minmax(0,1fr)]"
                : "lg:grid-cols-[300px_minmax(0,1fr)]",
            )}
          >
            <DashboardSidebar
              className="hidden lg:flex"
              collapsed={isDesktopSidebarCollapsed}
              onToggleCollapsed={() => setIsDesktopSidebarCollapsed((previous) => !previous)}
              showCollapseToggle
            />

            <main
              className={cn(
                "no-scrollbar min-h-0 overflow-y-auto lg:h-full",
                isDesktopSidebarCollapsed ? "lg:pl-6" : "lg:pl-10",
              )}
            >
              {children}
            </main>
          </div>

          {isSidebarOpen ? (
            <div className="absolute inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close dashboard menu overlay"
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-base-black/30"
              />

              <div className="absolute inset-y-0 left-0 w-75 max-w-[86vw] bg-surface-muted-100 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between border-b border-line-weaker px-4 py-3">
                  <p className="text-sm font-medium text-text-strong">Dashboard Overview</p>
                  <button
                    type="button"
                    aria-label="Close dashboard menu"
                    onClick={() => setIsSidebarOpen(false)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-line-weaker text-text-strong transition-colors hover:bg-fill-hover"
                  >
                    <X size={16} />
                  </button>
                </div>

                <DashboardSidebar
                  onNavigate={() => setIsSidebarOpen(false)}
                  className="h-[calc(100%-49px)] border-0"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}