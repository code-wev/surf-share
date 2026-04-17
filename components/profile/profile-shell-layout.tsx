import type { ReactNode } from "react";

import ProfileSidebar from "@/components/profile/profile-sidebar";

type ProfileShellLayoutProps = {
  children: ReactNode;
};

export default function ProfileShellLayout({ children }: ProfileShellLayoutProps) {
  return (
    <section className="h-full bg-white">
      <div className="mx-auto flex h-full max-w-470 flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:px-12.5 lg:py-12.5">
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto rounded-sm bg-surface-muted-100 md:overflow-hidden">
          <div className="grid h-full grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)]">
            <ProfileSidebar />

            <main className="no-scrollbar md:h-full md:min-h-0 md:overflow-y-auto md:pl-10">
              {children}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
