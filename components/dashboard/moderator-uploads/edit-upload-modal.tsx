"use client";

import { useEffect, useState } from "react";
import { X, Loader2, MapPin, DollarSign, Type, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useLocationsQuery } from "@/hooks/api/useLocations";
import { useUpdatePhotoMutation } from "@/hooks/api/usePhotos";
import { Input } from "@/components/ui/input";
import { PHOTO_PRICES } from "@/components/profile/contributor-profile/image-upload/image-upload-content";

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
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [locationId, setLocationId] = useState("");
  const [capturedAt, setCapturedAt] = useState("");

  const { data: locationsData } = useLocationsQuery({ page: 1, limit: 100 });
  const locations = (locationsData?.data as Location[]) || [];

  const updateMutation = useUpdatePhotoMutation();

  useEffect(() => {
    if (upload) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(upload.name !== "Photo" ? upload.name : "");
      setPrice(upload.priceValue.toString());
      setLocationId(upload.locationId);

      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      if (upload.uploadedAt) {
        const date = new Date(upload.uploadedAt);
        const formattedDate = date.toISOString().slice(0, 16);
        setCapturedAt(formattedDate);
      }
    }
  }, [upload]);

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

    updateMutation.mutate(
      {
        id: upload.id,
        payload: {
          title: title.trim(),
          price: Number(price),
          locationId,
          capturedAt: new Date(capturedAt).toISOString(),
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

          <div className="flex items-center justify-end gap-3 border-t border-line-weaker pt-4">
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
