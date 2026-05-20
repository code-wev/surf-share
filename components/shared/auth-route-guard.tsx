"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getRoleHomePath, isDashboardRole, useAuth } from "@/lib/auth";

export default function AuthRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isHydrated } = useAuth();

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

    if (isAdminOnlyDashboardRoute && session.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    // Moderator Permission Checks
    if (session.role === "MODERATOR") {
      const userPermissions = session.permissions || [];
      const hasAllAccess = userPermissions.includes("ALL_ACCESS");

      const isUserManagement =
        pathname === "/dashboard/user-management" ||
        pathname.startsWith("/dashboard/user-management/");
      const isPhotoModeration =
        pathname === "/dashboard/photo-moderation" ||
        pathname.startsWith("/dashboard/photo-moderation/");
      const isLocationsModeration =
        pathname === "/dashboard/locations-moderation" ||
        pathname.startsWith("/dashboard/locations-moderation/");

      if (isUserManagement && !hasAllAccess) {
        router.replace("/dashboard");
        return;
      }

      if (isPhotoModeration && !hasAllAccess && !userPermissions.includes("APPROVE_PHOTO")) {
        router.replace("/dashboard");
        return;
      }

      if (isLocationsModeration && !hasAllAccess && !userPermissions.includes("ADD_LOCATION")) {
        router.replace("/dashboard");
        return;
      }
    }

    if (isProfileRoute && isDashboardRole(session.role)) {
      router.replace("/dashboard");
    }
  }, [isHydrated, pathname, router, session]);

  return null;
}
