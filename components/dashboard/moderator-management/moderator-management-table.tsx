import Image from "next/image";
import { Eye, Trash2 } from "lucide-react";

import type {
  ModeratorRow,
  ModeratorStatus,
} from "@/components/dashboard/moderator-management/moderator-management-types";

type ModeratorManagementTableProps = {
  rows: ModeratorRow[];
  statusClassNameMap: Record<ModeratorStatus, string>;
  onViewDetails: (moderator: ModeratorRow) => void;
  onDelete?: (moderator: ModeratorRow) => void;
};

export default function ModeratorManagementTable({
  rows,
  statusClassNameMap,
  onViewDetails,
  onDelete,
}: ModeratorManagementTableProps) {
  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-3 lg:hidden">
        {rows.map((row) => (
          <article
            key={row.id}
            className="border-line-weaker bg-surface-muted-100 rounded-sm border p-3"
          >
            <div className="flex items-start gap-3">
              {row.photo ? (
                <Image
                  src={row.photo}
                  alt={row.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E5E7EB] text-xs text-[#6B7280]">
                  {getInitials(row.name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-text-strong truncate text-sm font-semibold">{row.name}</p>
                <p className="text-text-weak mt-0.5 truncate text-xs">{row.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] ${statusClassNameMap[row.status]}`}
                  >
                    {row.status === "Active" ? "✓" : "✕"} {row.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-text-weak mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <p>
                <span className="text-text-weaker block text-[11px] tracking-wide uppercase">
                  Phone
                </span>
                <span className="mt-0.5 block">{row.phone}</span>
              </p>
              <p>
                <span className="text-text-weaker block text-[11px] tracking-wide uppercase">
                  Assigned Date
                </span>
                <span className="mt-0.5 block">{row.assignedDate}</span>
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {row.assignedPermissions.map((perm) => (
                <span
                  key={perm}
                  className="inline-flex rounded-sm bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#6B7280]"
                >
                  {perm}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onViewDetails(row)}
                className="inline-flex items-center gap-1 text-xs text-[#0EA5E9] hover:underline"
              >
                <Eye size={12} /> View details
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(row)}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:underline"
                >
                  <Trash2 size={12} /> Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="border-line-weaker bg-surface-muted-100 mt-6 hidden overflow-x-auto border [font-family:var(--font-sf-pro)] lg:mt-9 lg:block">
        <table className="text-text-weak w-full min-w-280 border-collapse text-xs xl:min-w-0">
          <thead>
            <tr className="border-line-weaker text-text-strong border-b text-left font-semibold">
              <th className="p-2">Photo</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone Number</th>
              <th className="p-2">Assigned Date</th>
              <th className="p-2">Assigned Permissions</th>
              <th className="p-2">Status</th>
              <th className="p-2" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-line-weaker border-b last:border-b-0">
                <td className="p-2">
                  {row.photo ? (
                    <Image
                      src={row.photo}
                      alt={row.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5E7EB] text-[11px] text-[#6B7280]">
                      {getInitials(row.name)}
                    </div>
                  )}
                </td>
                <td className="p-2">{row.name}</td>
                <td className="p-2">{row.email}</td>
                <td className="p-2">{row.phone}</td>
                <td className="p-2">{row.assignedDate}</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-1">
                    {row.assignedPermissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex rounded-sm bg-[#F3F4F6] px-2 py-1 text-[11px] text-[#6B7280]"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 ${statusClassNameMap[row.status]}`}
                  >
                    {row.status === "Active" ? "✓" : "✕"} {row.status}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails(row)}
                      className="inline-flex items-center gap-1 text-[#0EA5E9] hover:underline"
                    >
                      <Eye size={12} /> View details
                    </button>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 hover:underline"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
