"use client";

import { Download, Heart, LogOut, Package, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useDemoAuth } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

const profileNavItems = [
  { label: "Profile", href: "/profile", Icon: UserRound },
  { label: "Order", href: "/profile/order", Icon: Package },
  { label: "Downloads", href: "/profile/download", Icon: Download },
  { label: "Favorites", href: "/profile/favorite", Icon: Heart },
] as const;

type ProfileSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export default function ProfileSidebar({ className, onNavigate }: ProfileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useDemoAuth();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    toast.success("Logged out.");
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "border-line-weaker bg-surface-muted-100 flex h-full min-h-0 w-full flex-col border",
        className,
      )}
    >
      <div className="p-4">
        <p className="text-text-weaker text-xs font-medium">Profile Overview</p>

        <ul className="mt-2">
          {profileNavItems.map((item) => {
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
                    color="#0D1420"
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
          onClick={onNavigate}
          className="text-danger-strong inline-flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-colors hover:opacity-80"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
