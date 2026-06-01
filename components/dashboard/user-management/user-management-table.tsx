import { ChevronsUpDown, Eye, Loader2 } from "lucide-react";
import Avatar from "@/components/shared/avatar";

import type {
  UserPlan,
  UserRow,
  UserStatus,
} from "@/components/dashboard/user-management/user-management-types";
import { useUpdateUserMutation } from "@/hooks/api/useUsers";

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
  const updateUserMutation = useUpdateUserMutation();

  const handleTogglePromotion = (userId: string, currentValue: boolean) => {
    updateUserMutation.mutate({
      userId,
      payload: { promotionEmail: !currentValue },
    });
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
              <Avatar
                src={row.photo}
                alt={row.name}
                size={44}
                className="h-11 w-11 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-text-strong truncate text-sm font-semibold">{row.name}</p>
                <p className="text-text-weak mt-0.5 truncate text-xs">{row.email}</p>

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

            <div className="text-text-weak mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <p>
                <span className="text-text-weaker block text-[11px] tracking-wide uppercase">
                  Phone
                </span>
                <span className="mt-0.5 block">{row.phone}</span>
              </p>
              <p>
                <span className="text-text-weaker block text-[11px] tracking-wide uppercase">
                  Contributed
                </span>
                <span className="mt-0.5 block">{row.contributedPhotos ?? "--"}</span>
              </p>
              <p>
                <span className="text-text-weaker block text-[11px] tracking-wide uppercase">
                  Promotion Email
                </span>
                <span className="mt-1 block">
                  <button
                    onClick={() => handleTogglePromotion(row.id, row.promotionEmail)}
                    disabled={updateUserMutation.isPending}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      row.promotionEmail ? "bg-brand-default" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        row.promotionEmail ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </span>
              </p>
              <p>
                <span className="text-text-weaker block text-[11px] tracking-wide uppercase">
                  Purchase
                </span>
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

      <div className="border-line-weaker bg-surface-muted-100 mt-6 hidden overflow-x-auto border [font-family:var(--font-sf-pro)] lg:mt-9 lg:block">
        <table className="text-text-weak w-full min-w-280 border-collapse text-xs xl:min-w-0">
          <thead>
            <tr className="border-line-weaker text-text-strong border-b text-left font-semibold">
              <th className="p-2">Name</th>
              <th className="p-2">Photo</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone Number</th>
              <th className="p-2">Role</th>
              <th className="p-2">Contributed Photos</th>
              <th className="p-2">Plan</th>
              <th className="p-2">Platform Commission</th>
              <th className="p-2">Purchase Photo</th>
              <th className="p-2">Promotion Email</th>
              <th className="p-2">Status</th>
              <th className="p-2" aria-label="Actions" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-line-weaker border-b last:border-b-0">
                <td className="p-2">
                  <Avatar
                    src={row.photo}
                    alt={row.name}
                    size={40}
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
                  <span
                    className={`inline-flex rounded-sm px-2 py-0.5 ${planClassNameMap[row.plan]}`}
                  >
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePromotion(row.id, row.promotionEmail)}
                      disabled={updateUserMutation.isPending}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        row.promotionEmail ? "bg-brand-default" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          row.promotionEmail ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    {updateUserMutation.isPending && updateUserMutation.variables?.userId === row.id && (
                      <Loader2 className="text-brand-default h-3 w-3 animate-spin" />
                    )}
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
