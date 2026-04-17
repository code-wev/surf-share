import type { ReactNode } from "react";

import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

type ProfileGroupLayoutProps = {
  children: ReactNode;
};

export default function ProfileGroupLayout({ children }: ProfileGroupLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="h-[calc(100vh-68px)] bg-white">{children}</main>
      <Footer />
    </div>
  );
}
