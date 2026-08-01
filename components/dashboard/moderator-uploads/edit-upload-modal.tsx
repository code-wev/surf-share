"use client";

import { PHOTO_PRICES } from "@/components/profile/contributor-profile/image-upload/image-upload-content";
import { Input } from "@/components/ui/input";
import { useLocationsQuery } from "@/hooks/api/useLocations";
import { useUpdatePhotoMutation } from "@/hooks/api/usePhotos";
import { Calendar, DollarSign, Loader2, MapPin, Type, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Location = {
  id: string;
  name: string;
  state: string;
};

type EditUploadModalProps = {
  upload: {
    id: string;
    name: string;
    locationId: string;
    priceValue: number;
    uploadedAt: string; // This is the current capturedAt or createdAt
  } | null;
  onClose: () => void;
};

export default function EditUploadModal({ upload, onClose }: EditUploadModalProps) {
  const getInitialCapturedAt = () => {
    if (!upload?.uploadedAt) return "";
    const date = new Date(upload.uploadedAt);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [title, setTitle] = useState(upload?.name !== "Photo" ? (upload?.name ?? "") : "");
  const [price, setPrice] = useState(upload?.priceValue.toString() ?? "");
  const [locationId, setLocationId] = useState(upload?.locationId ?? "");
  const [capturedAt, setCapturedAt] = useState(getInitialCapturedAt());

  const { data: locationsData } = useLocationsQuery({ page: 1, limit: 100 });
  const rawLocations = (locationsData?.data as Location[]) || [];
  const locations = [...rawLocations].sort((a, b) => a.name.localeCompare(b.name));

  const updateMutation = useUpdatePhotoMutation();

  if (!upload) return null;

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    if (!price || isNaN(Number(price))) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (!locationId) {
      toast.error("Please select a location.");
      return;
    }
    if (!capturedAt) {
      toast.error("Please select a date and time.");
      return;
    }

    // capturedAt from input is like "YYYY-MM-DDTHH:mm"
    const h = parseInt(capturedAt.split("T")[1].split(":")[0], 10);
    let timeKey = "23_5";
    if (h >= 4 && h < 8) timeKey = "5_8";
    else if (h >= 8 && h < 11) timeKey = "8_11";
    else if (h >= 11 && h < 14) timeKey = "11_14";
    else if (h >= 14 && h < 19) timeKey = "14_17";

    const utcCapturedAt = `${capturedAt}:00.000Z`;

    updateMutation.mutate(
      {
        id: upload.id,
        payload: {
          title: title.trim(),
          price: Number(price),
          locationId,
          capturedAt: utcCapturedAt,
          timeKey,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-6 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit upload details"
        onClick={(event) => event.stopPropagation()}
        className="border-line-weaker bg-surface-muted-100 w-full max-w-lg overflow-hidden rounded-lg border shadow-[0_20px_50px_rgba(15,23,42,0.25)]"
      >
        <div className="border-line-weaker flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-text-strong text-base font-semibold">Edit Photo Details</h2>
          <button
            type="button"
            aria-label="Close edit details"
            onClick={onClose}
            className="border-line-weaker text-text-strong hover:bg-fill-hover inline-flex h-8 w-8 items-center justify-center rounded-sm border"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-text-strong flex items-center gap-2 text-sm font-medium">
              <Type size={16} className="text-text-weaker" />
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Surf at Pipeline"
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-text-strong flex items-center gap-2 text-sm font-medium">
              <DollarSign size={16} className="text-text-weaker" />
              Price ($)
            </label>
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={updateMutation.isPending}
              className="border-line-weaker bg-surface-muted-100 text-text-weak focus-visible:ring-brand-default/30 h-10 w-full appearance-none rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="">Select Price</option>
              {PHOTO_PRICES.map((priceOption) => (
                <option key={priceOption} value={priceOption}>
                  {priceOption}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-text-strong flex items-center gap-2 text-sm font-medium">
              <Calendar size={16} className="text-text-weaker" />
              Date & Time Taken
            </label>
            <Input
              type="datetime-local"
              value={capturedAt}
              onChange={(e) => setCapturedAt(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-text-strong flex items-center gap-2 text-sm font-medium">
              <MapPin size={16} className="text-text-weaker" />
              Location
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              disabled={updateMutation.isPending}
              className="border-line-weaker bg-surface-muted-100 text-text-weak focus-visible:ring-brand-default/30 h-10 w-full appearance-none rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.state})
                </option>
              ))}
            </select>
          </div>

          <div className="border-line-weaker flex items-center justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="border-line-weaker text-text-weak hover:bg-fill-weak h-9 rounded-sm border px-4 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-9 items-center gap-2 rounded-sm px-4 text-sm font-medium transition-colors disabled:opacity-60"
            >
              {updateMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
