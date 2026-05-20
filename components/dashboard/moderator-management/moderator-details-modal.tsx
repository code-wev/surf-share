import Image from "next/image";
import { ChevronsRight, SquarePen, Loader2 } from "lucide-react";
import { useState } from "react";

import type {
  ModeratorRow,
  ModeratorStatus,
  AssignedPermission,
} from "@/components/dashboard/moderator-management/moderator-management-types";
import { useUpdateUserMutation, useUpdateUserStatusMutation } from "@/hooks/api/useUsers";

type ModeratorDetailsModalProps = {
  moderator: ModeratorRow | null;
  statusClassNameMap: Record<ModeratorStatus, string>;
  onClose: () => void;
};

type ModeratorDetailRowProps = {
  label: string;
  value: React.ReactNode;
};

function ModeratorDetailRow({ label, value }: ModeratorDetailRowProps) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-8 gap-y-1 py-1 [font-family:var(--font-sf-pro)] text-xs leading-tight sm:grid-cols-[140px_minmax(0,1fr)] sm:text-sm">
      <span className="text-text-strong font-medium">{label}</span>
      <div className="text-text-weak min-w-0">{value}</div>
    </div>
  );
}

const PERMISSION_OPTIONS: { value: string; label: AssignedPermission }[] = [
  { value: "ADD_LOCATION", label: "Add Location" },
  { value: "APPROVE_PHOTO", label: "Approve Photo" },
  { value: "ALL_ACCESS", label: "All Access" },
];

const PERMISSION_BACK_MAP: Record<AssignedPermission, string> = {
  "Add Location": "ADD_LOCATION",
  "Approve Photo": "APPROVE_PHOTO",
  "All Access": "ALL_ACCESS",
};

export default function ModeratorDetailsModal({ moderator, onClose }: ModeratorDetailsModalProps) {
  const [permissionOverridesByModeratorId, setPermissionOverridesByModeratorId] = useState<
    Record<string, string[]>
  >({});
  const updateMutation = useUpdateUserMutation();
  const statusMutation = useUpdateUserStatusMutation();

  if (!moderator) return null;

  const selectedPermissions =
    permissionOverridesByModeratorId[moderator.id] ??
    moderator.assignedPermissions.map((permission) => PERMISSION_BACK_MAP[permission]);

  const handlePermissionToggle = (value: string) => {
    let newPermissions: string[];
    if (selectedPermissions.includes(value)) {
      newPermissions = selectedPermissions.filter((p) => p !== value);
    } else {
      newPermissions = [...selectedPermissions, value];
    }
    setPermissionOverridesByModeratorId((previous) => ({
      ...previous,
      [moderator.id]: newPermissions,
    }));

    updateMutation.mutate({
      userId: moderator.id,
      payload: { permissions: newPermissions },
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    statusMutation.mutate({
      userId: moderator.id,
      status: newStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-100 bg-[#0d1420]/30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Moderator details"
        className="border-line-weaker absolute right-0 bottom-0 flex h-[80vh] w-full max-w-105 flex-col overflow-hidden rounded-lg border-t border-l bg-white shadow-[-18px_0_40px_rgba(15,23,42,0.14)] sm:max-w-140"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-line-weaker flex items-center justify-between border-b bg-white px-4.5 py-3">
          <div className="text-text-strong flex items-center gap-2">
            <button
              type="button"
              aria-label="Close moderator details"
              onClick={onClose}
              className="hover:bg-fill-hover inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors"
            >
              <ChevronsRight size={24} />
            </button>
          </div>

          <button
            type="button"
            aria-label="Edit moderator details"
            className="text-text-weak hover:bg-fill-hover hover:text-text-strong inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors"
          >
            <SquarePen size={24} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto bg-[#FAFAFA] px-6 pt-6">
          <div className="relative">
            <div className="border-line-weaker bg-fill-hover h-10 w-10 overflow-hidden rounded-full border">
              <Image
                src={moderator.photo}
                alt={`${moderator.name} thumbnail`}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3 pb-8">
            <ModeratorDetailRow label="Name" value={moderator.name} />
            <ModeratorDetailRow label="Email" value={moderator.email} />
            <ModeratorDetailRow label="Phone Number" value={moderator.phone} />
            <ModeratorDetailRow label="Assigned Date" value={moderator.assignedDate} />

            <ModeratorDetailRow
              label="Permissions"
              value={
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    {PERMISSION_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2 text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(opt.value)}
                          onChange={() => handlePermissionToggle(opt.value)}
                          disabled={updateMutation.isPending}
                          className="border-line-weak text-brand-default focus:ring-brand-default size-3.5 rounded"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {updateMutation.isPending && (
                    <div className="text-brand-default flex items-center gap-1 text-[10px]">
                      <Loader2 size={10} className="animate-spin" />
                      Updating...
                    </div>
                  )}
                </div>
              }
            />

            <ModeratorDetailRow
              label="Status"
              value={
                <div className="flex items-center gap-2">
                  <select
                    className="border-line-weaker text-text-strong focus:ring-brand-default h-8 rounded-sm border bg-white px-2 text-xs focus:ring-1 focus:outline-none"
                    value={moderator.status.toUpperCase()}
                    onChange={handleStatusChange}
                    disabled={statusMutation.isPending}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                  {statusMutation.isPending && (
                    <Loader2 size={12} className="text-brand-default animate-spin" />
                  )}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
