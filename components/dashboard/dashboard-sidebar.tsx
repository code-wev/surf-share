"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  Images,
  LayoutGrid,
  LogOut,
  MapPin,
  Megaphone,
  Settings,
  Shield,
  UsersRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type DashboardNavItem = {
  label: string;
  Icon: typeof LayoutGrid;
  href: string;
  permission?: string;
};

const commonDashboardNavItems: ReadonlyArray<DashboardNavItem> = [
  { label: "Overview", Icon: LayoutGrid, href: "/dashboard" },
];

const moderatorDashboardNavItems: ReadonlyArray<DashboardNavItem> = [
  {
    label: "User Management",
    Icon: UsersRound,
    href: "/dashboard/user-management",
    permission: "ALL_ACCESS",
  },
  {
    label: "Photo Moderation",
    Icon: ImageIcon,
    href: "/dashboard/photo-moderation",
    permission: "APPROVE_PHOTO",
  },
  {
    label: "Uploaded Photos",
    Icon: Images,
    href: "/dashboard/uploaded-photos",
    permission: "APPROVE_PHOTO",
  },
  {
    label: "Locations Moderation",
    Icon: MapPin,
    href: "/dashboard/locations-moderation",
    permission: "ADD_LOCATION",
  },
];

const adminDashboardNavItems: ReadonlyArray<DashboardNavItem> = [
  { label: "User Management", Icon: UsersRound, href: "/dashboard/user-management" },
  { label: "Moderator Management", Icon: Shield, href: "/dashboard/moderator-management" },
  {
    label: "Advertisement Settings",
    Icon: Megaphone,
    href: "/dashboard/advertisement-settings",
  },
];

const finalDashboardNavItems: ReadonlyArray<DashboardNavItem> = [
  { label: "Profile Settings", Icon: Settings, href: "/dashboard/profile" },
];

type DashboardSidebarProps = {
  className?: string;
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  showCollapseToggle?: boolean;
};

export default function DashboardSidebar({
  className,
  onNavigate,
  collapsed = false,
  onToggleCollapsed,
  showCollapseToggle = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, session } = useAuth();
  const isAdmin = session?.role === "ADMIN";
  const userPermissions = session?.permissions || [];
  const hasAllAccess = userPermissions.includes("ALL_ACCESS");

  const getDashboardNavItems = () => {
    if (isAdmin) {
      return [...commonDashboardNavItems, ...adminDashboardNavItems, ...finalDashboardNavItems];
    }

    const filteredModeratorItems = moderatorDashboardNavItems.filter((item) => {
      if (!item.permission) return true;
      if (hasAllAccess) return true;
      return userPermissions.includes(item.permission);
    });

    return [...commonDashboardNavItems, ...filteredModeratorItems, ...finalDashboardNavItems];
  };

  const dashboardNavItems = getDashboardNavItems();

  const roleLabel = session?.role
    ? `${session.role[0].toUpperCase()}${session.role.slice(1).toLowerCase()}`
    : "Moderator";

  const handleLogout = () => {
    logout();
    onNavigate?.();
    toast.success("Logged out.");
    router.push("/login");
  };

  const isItemActive = (href?: string) => {
    if (!href) {
      return false;
    }

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleItemClick = (href?: string) => {
    if (href) {
      router.push(href);
    }

    onNavigate?.();
  };

  return (
    <aside className={cn("bg-surface-muted-100 flex h-full min-h-0 w-full flex-col", className)}>
      <div className={cn("p-0", collapsed ? "px-3" : "")}>
        <div
          className={cn(
            "mb-2 flex items-center px-4.5 py-3.5",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed ? <p className="text-text-strong text-base">{roleLabel}</p> : null}

          {showCollapseToggle ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="text-text-strong hover:bg-fill-hover inline-flex h-8 w-8 items-center justify-center rounded-sm transition-colors"
            >
              {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </button>
          ) : null}
        </div>

        <div className="px-3 py-2">
          {!collapsed ? <p className="text-text-weaker text-xs font-medium">Operation</p> : null}

          <ul className="mt-2">
            {dashboardNavItems.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item.href)}
                  title={collapsed ? item.label : undefined}
                  className={`flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors ${
                    collapsed ? "justify-center" : "gap-2"
                  } ${
                    isItemActive(item.href)
                      ? "bg-fill-disable text-text-strong font-medium"
                      : "text-text-weak hover:bg-fill-hover hover:text-text-strong font-normal"
                  }`}
                >
                  <item.Icon size={18} />
                  {!collapsed ? <span>{item.label}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={cn("mt-auto px-4 py-2", collapsed ? "px-3" : "")}>
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "text-danger-strong inline-flex items-center px-2 py-1.5 text-sm font-medium transition-colors hover:opacity-80",
            collapsed ? "w-full justify-center" : "gap-2",
          )}
        >
          <LogOut size={18} />
          {!collapsed ? "Logout" : null}
        </button>
      </div>
    </aside>
  );
}
