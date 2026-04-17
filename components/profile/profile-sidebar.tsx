import { Download, Heart, LogOut, Package, UserRound } from "lucide-react";

const profileNavItems = [
  { label: "Profile", Icon: UserRound },
  { label: "Order", Icon: Package },
  { label: "Downloads", Icon: Download },
  { label: "Favorites", Icon: Heart },
] as const;

export default function ProfileSidebar() {
  return (
    <aside className="flex h-full w-75 flex-col border border-line-weaker bg-surface-muted-100">
      <div className="p-4">
        <p className="text-xs font-medium text-text-weaker">Profile Overview</p>

        <ul className="mt-2">
          {profileNavItems.map((item, index) => (
            <li key={item.label}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors ${
                  index === 0
                    ? "bg-[#FAFAFA] font-medium text-text-strong"
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

      <div className="mt-auto border-t border-line-weaker px-4 py-2">
        <button
          type="button"
          className="px-2 py-1.5 inline-flex items-center gap-2 text-sm font-medium text-danger-strong transition-colors hover:opacity-80"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}
