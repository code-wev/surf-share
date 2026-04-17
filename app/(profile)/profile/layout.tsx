import type { ReactNode } from "react";

import ProfileShellLayout from "@/components/profile/profile-shell-layout";

type ProfileLayoutProps = {
  children: ReactNode;
};

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <ProfileShellLayout>{children}</ProfileShellLayout>;
}
