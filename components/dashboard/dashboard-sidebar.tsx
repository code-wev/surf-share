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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useDemoAuth } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

const dashboardNavItems = [
  { label: "Overview", Icon: LayoutGrid },
  { label: "User Management", Icon: UsersRound },
  { label: "Photo Moderation", Icon: ImageIcon },
  { label: "Locations Moderation", Icon: MapPin },
  { label: "Profile Settings", Icon: Settings },
] as const;

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
  const router = useRouter();
  const { logout, session } = useDemoAuth();

  const roleLabel = session?.role ? `${session.role[0].toUpperCase()}${session.role.slice(1)}` : "Moderator";

  const handleLogout = () => {
    logout();
    onNavigate?.();
    toast.success("Logged out.");
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-full flex-col bg-surface-muted-100",
        className,
      )}
    >
      <div className={cn("p-4", collapsed ? "px-3" : "") }>
        <div className={cn("mb-4 flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed ? <p className="text-[34px] text-text-strong">{roleLabel}</p> : null}

          {showCollapseToggle ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-text-strong transition-colors hover:bg-fill-hover"
            >
              {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </button>
          ) : null}
        </div>

        {!collapsed ? <p className="text-xs font-medium text-text-weaker">Operation</p> : null}

        <ul className="mt-2">
          {dashboardNavItems.map((item, index) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={`flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors ${
                  collapsed ? "justify-center" : "gap-2"
                } ${
                  index === 0
                    ? "bg-fill-disable font-medium text-text-strong"
                    : "font-normal text-text-weak hover:bg-fill-hover hover:text-text-strong"
                }`}
              >
                <item.Icon size={18} />
                {!collapsed ? <span>{item.label}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("mt-auto border-t border-line-weaker px-4 py-2", collapsed ? "px-3" : "") }>
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "inline-flex items-center px-2 py-1.5 text-sm font-medium text-danger-strong transition-colors hover:opacity-80",
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