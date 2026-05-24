"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Download,
  Heart,
  LogOut,
  Package,
  Upload,
  TrendingUp,
  UserRound,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type ProfileSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export default function ProfileSidebar({ className, onNavigate }: ProfileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isHydrated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    toast.success("Logged out.");
    router.push("/login");
  };

  // Keep role-specific menus hidden until auth state is ready to avoid flicker.
  if (!isHydrated) {
    return (
      <aside
        className={cn(
          "border-line-weaker bg-surface-muted-100 flex h-full min-h-0 w-full flex-col border",
          className,
        )}
      >
        <div className="p-4">
          <p className="text-text-weaker text-xs font-medium">Loading menu...</p>
        </div>
      </aside>
    );
  }

  // Define navigation items based on role
  const isContributor = session?.role === "PHOTOGRAPHER";

  const navItems = isContributor
    ? [
        { label: "Overview", href: "/profile/overview", Icon: LayoutDashboard },
        { label: "My Uploads", href: "/profile/my-uploads", Icon: Package },
        { label: "Upload New", href: "/profile/image-upload", Icon: Upload },
        { label: "Sales", href: "/profile/sales", Icon: TrendingUp },
        { label: "Profile", href: "/profile", Icon: UserRound },
      ]
    : [
        { label: "Profile", href: "/profile", Icon: UserRound },
        { label: "Order", href: "/profile/order", Icon: Package },
        { label: "Downloads", href: "/profile/download", Icon: Download },
        { label: "Favorites", href: "/profile/favorite", Icon: Heart },
      ];

  return (
    <aside
      className={cn(
        "border-line-weaker bg-surface-muted-100 flex h-full min-h-0 w-full flex-col rounded-sm border",
        className,
      )}
    >
      <div className="p-4">
        <p className="text-text-weaker text-xs font-medium">
          {isContributor ? "Photographer Dashboard" : "Profile Overview"}
        </p>

        <ul className="mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-fill-disable text-text-strong font-medium"
                      : "text-text-weak hover:bg-fill-hover hover:text-text-strong font-normal",
                  )}
                >
                  <item.Icon
                    size={16}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-text-strong" : "text-text-weak group-hover:text-text-strong",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-line-weaker mt-auto border-t px-4 py-2">
        <button
          type="button"
          onClick={handleLogout}
          className="text-danger-strong inline-flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-colors hover:opacity-80"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
