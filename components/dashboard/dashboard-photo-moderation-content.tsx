"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import PhotoModerationGrid from "@/components/dashboard/photo-moderation/photo-moderation-grid";
import PhotoModerationHeader from "@/components/dashboard/photo-moderation/photo-moderation-header";
import type {
  ModerationAction,
  PhotoModerationItem,
} from "@/components/dashboard/photo-moderation/photo-moderation-types";
import PhotoModerationDetailsModal from "./photo-moderation/photo-moderation-details-modal";
import {
  getPhotos,
  updatePhotoStatus,
  bulkUpdatePhotoStatus,
  type PhotoModerationApiPhoto,
} from "@/src/actions/photo.action";
import { Loader2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import EditUploadModal from "../profile/contributor-profile/my-uploads/edit-upload-modal";
import DeleteUploadModal from "../profile/contributor-profile/my-uploads/delete-upload-modal";

const getApiOrigin = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return "";
  }

  try {
    return new URL(baseUrl).origin;
  } catch {
    return "";
  }
};

const toAbsoluteImageUrl = (value: string) => {
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const apiOrigin = getApiOrigin();

  if (!apiOrigin) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${apiOrigin}${value}`;
  }

  return `${apiOrigin}/${value}`;
};

export default function DashboardPhotoModerationContent() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<PhotoModerationItem | null>(null);
  const [editingUpload, setEditingUpload] = useState<PhotoModerationItem | null>(null);
  const [deletingUpload, setDeletingUpload] = useState<PhotoModerationItem | null>(null);

  // Fetch pending photos
  const {
    data: photosResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pending-photos"],
    queryFn: () => getPhotos({ status: "PENDING" }),
  });

  const photoItems: PhotoModerationItem[] = useMemo(() => {
    if (!photosResponse?.data) return [];

    const items = photosResponse.data.map((photo: PhotoModerationApiPhoto) => {
      const resolution = photo.width && photo.height ? `${photo.width}x${photo.height}` : "N/A";

      const format = photo.format ? photo.format.toUpperCase() : "N/A";

      const size = formatFileSize(photo.fileSize);

      const takenDate = new Date(photo.capturedAt || photo.createdAt);
      const perfectDate = `${takenDate.toLocaleDateString()} at ${takenDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

      return {
        id: photo.id,
        imageSrc: toAbsoluteImageUrl(photo.imageUrl),
        images: [toAbsoluteImageUrl(photo.imageUrl)],
        title: photo.title || `${photo.photographer?.name || "Photographer"}'s upload`,
        priceLabel: `$${photo.price}`,
        priceValue: photo.price,
        photographer: photo.photographer?.name || "Unknown",
        location: photo.location?.name || "Unknown Location",
        locationId: photo.locationId,
        imageCount: 1,
        dateTaken: perfectDate,
        uploadedAt: photo.capturedAt || photo.createdAt,
        resolution,
        format,
        size,
        submittedAt: new Date(photo.createdAt).toLocaleDateString(),
        status: photo.status,
      };
    });
    // Add related photos from same photographer (max 5)
    return items.map((item: PhotoModerationItem) => ({
      ...item,
      relatedPhotos: items
        .filter(
          (photo: PhotoModerationItem) =>
            photo.photographer === item.photographer && photo.id !== item.id,
        )
        .slice(0, 5),
    }));
  }, [photosResponse]);

  const allSelected = useMemo(
    () => photoItems.length > 0 && selectedIds.size === photoItems.length,
    [selectedIds, photoItems],
  );

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIds(new Set());
        setActiveItem(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeItem]);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }

    setSelectedIds(new Set(photoItems.map((item) => item.id)));
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  // Mutations for single and bulk actions
  const singleActionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updatePhotoStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["pending-photos"] });
      toast.success(`Photo ${status.toLowerCase()} successfully.`);
      setActiveItem(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update photo status.");
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      bulkUpdatePhotoStatus(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: ["pending-photos"] });
      toast.success(`${ids.length} photos ${status.toLowerCase()} successfully.`);
      setSelectedIds(new Set());
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update bulk photo status.");
    },
  });

  const handleSingleAction = (id: string, action: ModerationAction) => {
    const item = photoItems.find((i) => i.id === id);
    if (!item) return;

    if (action === "edit") {
      setEditingUpload(item);
      return;
    }

    if (action === "delete") {
      setDeletingUpload(item);
      return;
    }

    const status = action === "approve" ? "APPROVED" : "REJECTED";
    singleActionMutation.mutate({ id, status });
  };

  const handleBulkAction = (action: ModerationAction) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const status = action === "approve" ? "APPROVED" : "REJECTED";
    bulkActionMutation.mutate({ ids, status });
  };

  return (
    <section className="px-3 pb-5 [font-family:var(--font-sf-pro)] sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <div className="mx-auto w-full max-w-420">
        <PhotoModerationHeader
          selectedCount={selectedIds.size}
          allSelected={allSelected}
          onToggleSelectAll={toggleSelectAll}
          onBulkApprove={() => handleBulkAction("approve")}
          onBulkReject={() => handleBulkAction("reject")}
        />

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="text-text-weak h-8 w-8 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-danger-strong text-lg">Failed to load pending photos.</p>
          </div>
        ) : photoItems.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-text-weak text-lg">No photos waiting for moderation.</p>
          </div>
        ) : (
          <PhotoModerationGrid
            items={photoItems}
            selectedIds={selectedIds}
            onToggleSelected={toggleSelected}
            onAction={handleSingleAction}
            onOpenItem={setActiveItem}
          />
        )}
      </div>

      <PhotoModerationDetailsModal
        key={activeItem?.id ?? "closed"}
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onAction={handleSingleAction}
        onSelectImage={(item) => setActiveItem(item)}
      />

      <EditUploadModal
        upload={
          editingUpload
            ? {
                id: editingUpload.id,
                name: editingUpload.title,
                locationId: editingUpload.locationId,
                priceValue: editingUpload.priceValue,
                uploadedAt: editingUpload.uploadedAt,
              }
            : null
        }
        onClose={() => setEditingUpload(null)}
      />

      <DeleteUploadModal
        upload={deletingUpload ? { id: deletingUpload.id, name: deletingUpload.title } : null}
        onClose={() => setDeletingUpload(null)}
      />
    </section>
  );
}
