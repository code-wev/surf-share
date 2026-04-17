import type { ReactNode } from "react";

import ProfileSidebar from "@/components/profile/profile-sidebar";

type ProfileShellLayoutProps = {
  children: ReactNode;
};

export default function ProfileShellLayout({ children }: ProfileShellLayoutProps) {
  return (
    <section className="h-full bg-white">
      <div className="mx-auto h-full max-w-470 px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:px-12.5 lg:py-12.5">
        <div className="h-full overflow-hidden rounded-sm bg-surface-muted-100">
          <div className="grid h-full grid-cols-1 md:grid-cols-[300px_1fr]">
            <ProfileSidebar />

            <main className="h-full p-4 sm:p-6 md:px-10 md:py-8">{children}</main>
          </div>
        </div>
      </div>
    </section>
  );
}
