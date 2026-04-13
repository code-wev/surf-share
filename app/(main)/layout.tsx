import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}
