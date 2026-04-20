import Image from "next/image";
import { ChevronsUpDown, Eye } from "lucide-react";

import type { UserPlan, UserRow, UserStatus } from "@/components/dashboard/user-management/user-management-types";

type UserManagementTableProps = {
  rows: UserRow[];
  planClassNameMap: Record<UserPlan, string>;
  statusClassNameMap: Record<UserStatus, string>;
  onViewDetails: (user: UserRow) => void;
};

export default function UserManagementTable({
  rows,
  planClassNameMap,
  statusClassNameMap,
  onViewDetails,
}: UserManagementTableProps) {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-3 lg:hidden">
        {rows.map((row) => (
          <article key={row.id} className="rounded-sm border border-line-weaker bg-surface-muted-100 p-3">
            <div className="flex items-start gap-3">
              <Image
                src={row.photo}
                alt={row.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-strong">{row.name}</p>
                <p className="mt-0.5 truncate text-xs text-text-weak">{row.email}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-sm bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#6B7280]">
                    {row.role}
                  </span>
                  <span
                    className={`inline-flex rounded-sm px-2 py-0.5 text-[11px] ${planClassNameMap[row.plan]}`}
                  >
                    {row.plan}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] ${statusClassNameMap[row.status]}`}
                  >
                    {row.status === "Active" ? "✓" : "✕"} {row.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-text-weak">
              <p>
                <span className="block text-[11px] uppercase tracking-wide text-text-weaker">Phone</span>
                <span className="mt-0.5 block">{row.phone}</span>
              </p>
              <p>
                <span className="block text-[11px] uppercase tracking-wide text-text-weaker">Contributed</span>
                <span className="mt-0.5 block">{row.contributedPhotos ?? "--"}</span>
              </p>
              <p>
                <span className="block text-[11px] uppercase tracking-wide text-text-weaker">Commission</span>
                <span className="mt-0.5 inline-flex items-center gap-1">
                  {row.platformCommission ?? "--"}
                  {row.showCommissionSortIcon ? (
                    <ChevronsUpDown size={11} className="text-text-weaker" />
                  ) : null}
                </span>
              </p>
              <p>
                <span className="block text-[11px] uppercase tracking-wide text-text-weaker">Purchase</span>
                <span className="mt-0.5 block">{row.purchasePhoto ?? "--"}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onViewDetails(row)}
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#0EA5E9] hover:underline"
            >
              <Eye size={12} />
              View details
            </button>
          </article>
        ))}
      </div>

      <div className="mt-6 hidden overflow-x-auto border border-line-weaker bg-surface-muted-100 lg:mt-9 lg:block [font-family:var(--font-sf-pro)]">
        <table className="w-full min-w-280 border-collapse text-xs text-text-weak xl:min-w-0">
          <thead>
            <tr className="border-b border-line-weaker text-left font-semibold text-text-strong">
              <th className="p-2">Name</th>
              <th className="p-2">Photo</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone Number</th>
              <th className="p-2">Role</th>
              <th className="p-2">Contributed Photos</th>
              <th className="p-2">Plan</th>
              <th className="p-2">Platform Commission</th>
              <th className="p-2">Purchase Photo</th>
              <th className="p-2">Status</th>
              <th className="p-2" aria-label="Actions" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line-weaker last:border-b-0">
                <td className="p-2">
                  <Image
                    src={row.photo}
                    alt={row.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </td>

                <td className="p-2">{row.name}</td>
                <td className="p-2">{row.email}</td>
                <td className="p-2">{row.phone}</td>

                <td className="p-2">
                  <span className="inline-flex rounded-sm bg-[#F3F4F6] px-2 py-0.5 text-[#6B7280]">
                    {row.role}
                  </span>
                </td>

                <td className="p-2">{row.contributedPhotos ?? "--"}</td>

                <td className="p-2">
                  <span className={`inline-flex rounded-sm px-2 py-0.5 ${planClassNameMap[row.plan]}`}>
                    {row.plan}
                  </span>
                </td>

                <td className="p-2">
                  <div className="inline-flex items-center gap-1">
                    <span>{row.platformCommission ?? "--"}</span>
                    {row.showCommissionSortIcon ? (
                      <ChevronsUpDown size={11} className="text-text-weaker" />
                    ) : null}
                  </div>
                </td>

                <td className="p-2">{row.purchasePhoto ?? "--"}</td>

                <td className="p-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 ${statusClassNameMap[row.status]}`}
                  >
                    {row.status === "Active" ? "✓" : "✕"} {row.status}
                  </span>
                </td>

                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails(row)}
                    className="inline-flex items-center gap-1 text-[#0EA5E9] hover:underline"
                  >
                    <Eye size={12} />
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
