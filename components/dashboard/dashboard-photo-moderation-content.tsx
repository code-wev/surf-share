"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { photoModerationItems } from "@/components/dashboard/photo-moderation/photo-moderation-data";
import PhotoModerationGrid from "@/components/dashboard/photo-moderation/photo-moderation-grid";
import PhotoModerationHeader from "@/components/dashboard/photo-moderation/photo-moderation-header";
import type { ModerationAction } from "@/components/dashboard/photo-moderation/photo-moderation-types";

export default function DashboardPhotoModerationContent() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const allSelected = useMemo(
    () => photoModerationItems.length > 0 && selectedIds.size === photoModerationItems.length,
    [selectedIds],
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }

    setSelectedIds(new Set(photoModerationItems.map((item) => item.id)));
  };

  const toggleSelected = (id: number) => {
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

  const handleSingleAction = (id: number, action: ModerationAction) => {
    const message = action === "approve" ? "Photo approved." : "Photo rejected.";
    toast.success(message);

    setSelectedIds((previous) => {
      if (!previous.has(id)) {
        return previous;
      }

      const next = new Set(previous);
      next.delete(id);
      return next;
    });
  };

  const handleBulkAction = (action: ModerationAction) => {
    const count = selectedIds.size;

    if (count === 0) {
      return;
    }

    const message =
      action === "approve"
        ? `${count} submission${count > 1 ? "s" : ""} approved.`
        : `${count} submission${count > 1 ? "s" : ""} rejected.`;

    toast.success(message);
    setSelectedIds(new Set());
  };

  return (
    <section className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5 [font-family:var(--font-sf-pro)]">
      <div className="mx-auto w-full max-w-420">
        <PhotoModerationHeader
          selectedCount={selectedIds.size}
          allSelected={allSelected}
          onToggleSelectAll={toggleSelectAll}
          onBulkApprove={() => handleBulkAction("approve")}
          onBulkReject={() => handleBulkAction("reject")}
        />

        <PhotoModerationGrid
          items={photoModerationItems}
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          onAction={handleSingleAction}
        />
      </div>
    </section>
  );
}
