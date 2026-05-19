"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import AddModeratorModal, {
  type AddModeratorModalPayload,
} from "@/components/dashboard/moderator-management/add-moderator-modal";
import ModeratorDetailsModal from "@/components/dashboard/moderator-management/moderator-details-modal";
import ModeratorManagementHeader from "@/components/dashboard/moderator-management/moderator-management-header";
import ModeratorManagementPagination from "@/components/dashboard/moderator-management/moderator-management-pagination";
import ModeratorManagementTable from "@/components/dashboard/moderator-management/moderator-management-table";
import {
  filterOptions,
  statusClassNameMap,
} from "@/components/dashboard/moderator-management/moderator-management-data";
import type {
  FilterOption,
  ModeratorRow,
  AssignedPermission,
} from "@/components/dashboard/moderator-management/moderator-management-types";
import { apiClient } from "@/lib/api/client";

type ApiModerator = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  permissions?: string[];
  profileImageUrl?: string | null;
  status?: string;
};

export default function DashboardModeratorManagementContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("Recently Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModerator, setSelectedModerator] = useState<ModeratorRow | null>(null);
  const [isAddModeratorModalOpen, setIsAddModeratorModalOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["moderators", currentPage],
    queryFn: async () => {
      const response = await apiClient.get("/users", {
        params: {
          role: "MODERATOR",
          page: currentPage,
          limit: 10,
        },
      });
      return response.data;
    },
  });

  const registerModeratorMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      password?: string;
      permissions: string[];
    }) => {
      const response = await apiClient.post("/auth/register/moderator", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Moderator registered successfully.");
      setIsAddModeratorModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["moderators"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to register moderator.";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!filterDropdownRef.current) {
        return;
      }

      if (!filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (!selectedModerator) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedModerator(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedModerator]);

  const mapBackendPermissionToFrontend = (perm: string): AssignedPermission => {
    if (perm === "APPROVE_PHOTO") return "Approve Photo";
    if (perm === "ADD_LOCATION") return "Add Location";
    if (perm === "ALL_ACCESS") return "All Access";
    return "Approve Photo";
  };

  const mapBackendStatusToFrontend = (backendStatus?: string) => {
    if (!backendStatus) return "Active" as const;
    if (backendStatus === "ACTIVE") return "Active" as const;
    if (backendStatus === "SUSPENDED") return "Suspended" as const;
    return "Active" as const;
  };

  const mapFrontendPermissionToBackend = (perm: AssignedPermission): string => {
    if (perm === "Approve Photo") return "APPROVE_PHOTO";
    if (perm === "Add Location") return "ADD_LOCATION";
    if (perm === "All Access") return "ALL_ACCESS";
    return "APPROVE_PHOTO";
  };

  const mappedRows: ModeratorRow[] = useMemo(() => {
    return (
      data?.data?.map((mod: ApiModerator) => {
        const backendPerms = Array.isArray(mod.permissions) ? mod.permissions : [];

        return {
          id: mod.id,
          photo: (mod.profileImageUrl as string) || "/home/latest/latest1.jpg",
          name: mod.name,
          email: mod.email,
          phone: mod.phoneNumber || "-",
          assignedDate: mod.createdAt ? new Date(mod.createdAt).toLocaleDateString("en-GB") : "-",
          assignedPermissions: backendPerms.map(mapBackendPermissionToFrontend),
          status: mapBackendStatusToFrontend(mod.status),
        };
      }) || []
    );
  }, [data?.data]);

  const filteredRows = useMemo(() => {
    if (activeFilter === "View From Last") {
      return [...mappedRows].reverse();
    }
    return mappedRows;
  }, [activeFilter, mappedRows]);

  const handleAddModerator = ({
    name,
    email,
    password,
    assignedPermissions,
  }: AddModeratorModalPayload) => {
    registerModeratorMutation.mutate({
      name,
      email,
      password,
      permissions: assignedPermissions.map(mapFrontendPermissionToBackend),
    });
  };

  const totalPages = data?.meta?.totalPages || 1;

  return (
    <section className="px-3 pb-5 [font-family:var(--font-sf-pro)] sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <div className="mx-auto flex w-full max-w-400 flex-col">
        <ModeratorManagementHeader
          isFilterOpen={isFilterOpen}
          activeFilter={activeFilter}
          filterOptions={filterOptions}
          filterDropdownRef={filterDropdownRef}
          onToggleFilter={() => setIsFilterOpen((previous) => !previous)}
          onSelectFilter={(option) => {
            setActiveFilter(option);
            setIsFilterOpen(false);
          }}
          onOpenAddModerator={() => setIsAddModeratorModalOpen(true)}
        />

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-text-weaker">Loading moderators...</p>
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-danger-strong">Failed to load moderators.</p>
          </div>
        ) : (
          <ModeratorManagementTable
            rows={filteredRows}
            statusClassNameMap={statusClassNameMap}
            onViewDetails={(moderator) => setSelectedModerator(moderator)}
          />
        )}

        {totalPages > 1 && (
          <ModeratorManagementPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <ModeratorDetailsModal
          moderator={selectedModerator}
          statusClassNameMap={statusClassNameMap}
          onClose={() => setSelectedModerator(null)}
        />

        {isAddModeratorModalOpen ? (
          <AddModeratorModal
            onClose={() => setIsAddModeratorModalOpen(false)}
            onSubmit={handleAddModerator}
            isPending={registerModeratorMutation.isPending}
          />
        ) : null}
      </div>
    </section>
  );
}
