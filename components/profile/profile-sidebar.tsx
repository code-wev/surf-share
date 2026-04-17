import { Download, Heart, LogOut, Package, UserRound } from "lucide-react";

const profileNavItems = [
  { label: "Profile", Icon: UserRound },
  { label: "Order", Icon: Package },
  { label: "Downloads", Icon: Download },
  { label: "Favorites", Icon: Heart },
] as const;

export default function ProfileSidebar() {
  return (
    <aside className="flex h-full flex-col border border-line-weaker bg-surface-muted-100">
      <div className="p-4 sm:p-5">
        <p className="text-xs font-medium text-text-weaker">Profile Overview</p>

        <ul className="mt-2 space-y-0.5">
          {profileNavItems.map((item, index) => (
            <li key={item.label}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors ${
                  index === 0
                    ? "bg-fill-hover font-medium text-text-strong"
                    : "font-normal text-text-weak hover:bg-fill-hover hover:text-text-strong"
                }`}
              >
                <item.Icon size={14} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto border-t border-line-weaker p-4 sm:p-5">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-danger-strong transition-colors hover:opacity-80"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}
