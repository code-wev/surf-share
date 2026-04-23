"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getRoleHomePath, isDashboardRole, useDemoAuth } from "@/lib/demo-auth";

export default function AuthRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isHydrated } = useDemoAuth();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const isProfileRoute = pathname === "/profile" || pathname.startsWith("/profile/");
    const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
    const isAdminOnlyDashboardRoute =
      pathname === "/dashboard/moderator-management" ||
      pathname.startsWith("/dashboard/moderator-management/") ||
      pathname === "/dashboard/advertisement-settings" ||
      pathname.startsWith("/dashboard/advertisement-settings/");
    const isAuthRoute =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password" ||
      pathname === "/verify-identity" ||
      pathname === "/set-new-password";

    if (!session) {
      if (isProfileRoute || isDashboardRoute) {
        router.replace("/login");
      }

      return;
    }

    const roleHomePath = getRoleHomePath(session.role);

    if (isAuthRoute) {
      router.replace(roleHomePath);
      return;
    }

    if (isDashboardRoute && !isDashboardRole(session.role)) {
      router.replace("/profile");
      return;
    }

    if (isAdminOnlyDashboardRoute && session.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    if (isProfileRoute && isDashboardRole(session.role)) {
      router.replace("/dashboard");
    }
  }, [isHydrated, pathname, router, session]);

  return null;
}
