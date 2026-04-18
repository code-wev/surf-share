"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  LayoutGrid,
  LogOut,
  MapPin,
  Settings,
  UsersRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useDemoAuth } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

const dashboardNavItems = [
  { label: "Overview", Icon: LayoutGrid, href: "/dashboard" },
  { label: "User Management", Icon: UsersRound },
  { label: "Photo Moderation", Icon: ImageIcon },
  { label: "Locations Moderation", Icon: MapPin },
  { label: "Profile Settings", Icon: Settings, href: "/dashboard/profile" },
] as const satisfies ReadonlyArray<{
  label: string;
  Icon: typeof LayoutGrid;
  href?: string;
}>;

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
  const { logout, session } = useDemoAuth();

  const roleLabel = session?.role
    ? `${session.role[0].toUpperCase()}${session.role.slice(1)}`
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
      <div className={cn("p-4", collapsed ? "px-3" : "")}>
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
                {(() => {
                  const href = "href" in item ? item.href : undefined;

                  return (
                <button
                  type="button"
                  onClick={() => handleItemClick(href)}
                  title={collapsed ? item.label : undefined}
                  className={`flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors ${
                    collapsed ? "justify-center" : "gap-2"
                  } ${
                    isItemActive(href)
                      ? "bg-fill-disable text-text-strong font-medium"
                      : "text-text-weak hover:bg-fill-hover hover:text-text-strong font-normal"
                  }`}
                >
                  <item.Icon size={18} />
                  {!collapsed ? <span>{item.label}</span> : null}
                </button>
                  );
                })()}
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
