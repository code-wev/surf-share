"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideFooterRoutes = ["/map"];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      
      {!hideFooterRoutes.includes(pathname) && <Footer />}
    </div>
  );
}