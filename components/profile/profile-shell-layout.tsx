"use client";

import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import ProfileSidebar from "@/components/profile/profile-sidebar";

type ProfileShellLayoutProps = {
  children: ReactNode;
};

export default function ProfileShellLayout({ children }: ProfileShellLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="h-full bg-white">
      <div className="mx-auto flex h-full max-w-470 flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:px-12.5 lg:py-12.5">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm bg-surface-muted-100">
          <div className="flex items-center justify-between border-b border-line-weaker px-4 py-3 lg:hidden">
            <p className="text-sm font-medium text-text-strong">Profile Menu</p>
            <button
              type="button"
              aria-label="Open profile menu"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line-weaker text-text-strong transition-colors hover:bg-fill-hover"
            >
              <Menu size={18} />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
            <ProfileSidebar className="hidden lg:flex" />

            <main className="no-scrollbar min-h-0 overflow-y-auto lg:h-full lg:pl-10">
              {children}
            </main>
          </div>

          {isSidebarOpen ? (
            <div className="absolute inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close profile menu overlay"
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-base-black/30"
              />

              <div className="absolute inset-y-0 left-0 w-75 max-w-[86vw] bg-surface-muted-100 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between border-b border-line-weaker px-4 py-3">
                  <p className="text-sm font-medium text-text-strong">Profile Overview</p>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    onClick={() => setIsSidebarOpen(false)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-line-weaker text-text-strong transition-colors hover:bg-fill-hover"
                  >
                    <X size={16} />
                  </button>
                </div>

                <ProfileSidebar onNavigate={() => setIsSidebarOpen(false)} className="h-[calc(100%-49px)] border-0" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
