"use client";

import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AssignedPermission } from "@/components/dashboard/moderator-management/moderator-management-types";

export type AddModeratorModalPayload = {
  name: string;
  email: string;
  assignedPermissions: AssignedPermission[];
};

type AddModeratorModalProps = {
  onClose: () => void;
  onSubmit: (payload: AddModeratorModalPayload) => void;
};

const permissionOptions: ReadonlyArray<AssignedPermission> = [
  "Approve Photo",
  "Add Location",
  "All Access",
];

export default function AddModeratorModal({ onClose, onSubmit }: AddModeratorModalProps) {
  const [name, setName] = useState("MAkibul Hossain Tamim");
  const [email, setEmail] = useState("email@example.com");
  const [assignedPermissions, setAssignedPermissions] = useState<AssignedPermission[]>([
    "Approve Photo",
  ]);
  const [isPermissionMenuOpen, setIsPermissionMenuOpen] = useState(false);
  const permissionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (!isPermissionMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!permissionMenuRef.current) {
        return;
      }

      if (!permissionMenuRef.current.contains(event.target as Node)) {
        setIsPermissionMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPermissionMenuOpen]);

  const selectedPermissionsLabel = useMemo(() => {
    if (assignedPermissions.length === 0) {
      return "";
    }

    return assignedPermissions.join(", ");
  }, [assignedPermissions]);

  const togglePermission = (permission: AssignedPermission) => {
    setAssignedPermissions((previous) => {
      const hasPermission = previous.includes(permission);

      if (permission === "All Access") {
        return hasPermission ? [] : ["All Access"];
      }

      const nextPermissions = previous.filter((item) => item !== "All Access");

      if (hasPermission) {
        return nextPermissions.filter((item) => item !== permission);
      }

      return [...nextPermissions, permission];
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      assignedPermissions,
    });
  };

  return (
    <div
      className="fixed inset-0 z-1200 flex items-center justify-center bg-[#0f172a]/30 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-105 rounded-md border border-[#E7ECF4] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="px-4 py-3.5 sm:px-5 sm:py-4">
          <h2 className="text-[13px] font-medium text-[#1F2937] sm:text-[14px]">Add Moderator</h2>

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#1F2937]">Name</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="MAkibul Hossain Tamim"
                className="h-8 rounded-sm border-[#E5EAF2] bg-white px-3 text-[12px] text-[#667085] placeholder:text-[#98A2B3] focus-visible:ring-[#1D4ED8]/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#1F2937]">Email</span>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@example.com"
                className="h-8 rounded-sm border-[#E5EAF2] bg-white px-3 text-[12px] text-[#667085] placeholder:text-[#98A2B3] focus-visible:ring-[#1D4ED8]/20"
              />
            </label>

            <div className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#1F2937]">
                Assigned Permissions
              </span>

              <div className="relative" ref={permissionMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsPermissionMenuOpen((previous) => !previous)}
                  className="flex h-8 w-full items-center justify-between rounded-sm border border-[#E5EAF2] bg-white px-3 text-left text-[12px] text-[#98A2B3]"
                >
                  <span
                    className={cn(selectedPermissionsLabel ? "text-[#667085]" : "text-[#98A2B3]")}
                  >
                    {selectedPermissionsLabel || "Select Assigned Permission"}
                  </span>
                  <ChevronDown size={14} className="text-[#98A2B3]" />
                </button>

                {isPermissionMenuOpen ? (
                  <div className="absolute top-0 left-full z-30 ml-0.5 w-36.25 overflow-hidden rounded-sm border border-[#E5EAF2] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.1)]">
                    <div className="border-b border-[#EEF2F6] px-2.5 py-2 text-[11px] font-medium text-[#2753A3]">
                      Assigned Permissions
                    </div>

                    <div className="space-y-2 px-2.5 py-2.5">
                      {permissionOptions.map((permission) => {
                        const checked = assignedPermissions.includes(permission);

                        return (
                          <label
                            key={permission}
                            className="flex cursor-pointer items-center gap-2 text-[12px] text-[#667085]"
                          >
                            <span
                              className={cn(
                                "flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border text-black",
                                checked
                                  ? "border-[#111827] bg-[#111827]"
                                  : "border-[#98A2B3] bg-white",
                              )}
                            >
                              {checked ? (
                                <Check size={10} className="text-white" strokeWidth={3} />
                              ) : null}
                            </span>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(permission)}
                              className="sr-only"
                            />
                            <span>{permission}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex h-7 items-center gap-2 rounded-sm bg-[#163C86] px-4 text-[11px] font-medium text-white transition-colors hover:bg-[#123372]"
            >
              Send Email
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
