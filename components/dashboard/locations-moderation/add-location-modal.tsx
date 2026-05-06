"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, type FormEvent } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";

const AddLocationMapPicker = dynamic(
  () => import("@/components/dashboard/locations-moderation/add-location-map-picker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-fill-weak text-sm text-text-weak">
        Loading map...
      </div>
    ),
  },
);

export type AddLocationModalPayload = {
  name: string;
  parentSpot: string;
  region: string;
  state: string;
  latitude: number;
  longitude: number;
  previewImage: File;
};

type AddLocationModalProps = {
  initialCoordinates: [number, number];
  onClose: () => void;
  onSubmit: (payload: AddLocationModalPayload) => void;
  isPending?: boolean;
};

function formatCoordinate(value: number) {
  return value.toFixed(6);
}

export default function AddLocationModal({
  initialCoordinates,
  onClose,
  onSubmit,
  isPending,
}: AddLocationModalProps) {
  const [name, setName] = useState("");
  const [parentSpot, setParentSpot] = useState("");
  const [region, setRegion] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>(initialCoordinates);
  const [latitudeInput, setLatitudeInput] = useState(formatCoordinate(initialCoordinates[0]));
  const [longitudeInput, setLongitudeInput] = useState(formatCoordinate(initialCoordinates[1]));
  const [previewImage, setPreviewImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleMapCoordinatesChange = (nextCoordinates: [number, number]) => {
    setCoordinates(nextCoordinates);
    setLatitudeInput(formatCoordinate(nextCoordinates[0]));
    setLongitudeInput(formatCoordinate(nextCoordinates[1]));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setPreviewImage(file);
      } else {
        toast.error("Only image files are allowed.");
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const latitude = Number.parseFloat(latitudeInput);
    const longitude = Number.parseFloat(longitudeInput);

    if (!name.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      toast.error("Please provide valid spot name and coordinates.");
      return;
    }

    if (!previewImage) {
      toast.error("Preview image is mandatory.");
      return;
    }

    onSubmit({
      name: name.trim(),
      parentSpot: parentSpot.trim(),
      region: region.trim(),
      state: stateValue.trim(),
      latitude,
      longitude,
      previewImage,
    });
  };

  return (
    <div
      className="fixed inset-0 z-1200 flex items-center justify-center bg-black/45 p-3 sm:p-4 md:p-5"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-215 flex-col overflow-hidden rounded-sm border border-[#d6dde8] bg-[#dde5ef] shadow-[0_26px_70px_rgba(15,23,42,0.25)] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-2.5rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-52 shrink-0 p-2 sm:h-64 sm:p-3 md:h-80 md:p-4 lg:h-100">
          <AddLocationMapPicker
            coordinates={coordinates}
            onCoordinatesChange={handleMapCoordinatesChange}
          />
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-3 [font-family:var(--font-sf-pro)] sm:p-4 md:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4 md:gap-x-6">
              <label>
                <span className="mb-1 block text-sm font-medium text-text-strong sm:text-base">
                  Spot Name
                </span>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter the spot name"
                  disabled={isPending}
                  className="h-10 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-2 text-xs placeholder:text-[#98a4b7] sm:h-9"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-text-strong sm:text-base">
                  Parent Spot
                </span>
                <Input
                  value={parentSpot}
                  onChange={(event) => setParentSpot(event.target.value)}
                  placeholder="Enter the parent spot name"
                  disabled={isPending}
                  className="h-10 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-2 text-xs placeholder:text-[#98a4b7] sm:h-9"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-text-strong sm:text-base">
                  Region
                </span>
                <Input
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  placeholder="Enter the region"
                  disabled={isPending}
                  className="h-10 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-2 text-xs placeholder:text-[#98a4b7] sm:h-9"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-text-strong sm:text-base">
                  State
                </span>
                <Input
                  value={stateValue}
                  onChange={(event) => setStateValue(event.target.value)}
                  placeholder="Enter the state"
                  disabled={isPending}
                  className="h-10 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-2 text-xs placeholder:text-[#98a4b7] sm:h-9"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-text-strong sm:text-base">
                  Latitude
                </span>
                <Input
                  value={latitudeInput}
                  onChange={(event) => {
                    const value = event.target.value;
                    setLatitudeInput(value);

                    const parsed = Number.parseFloat(value);

                    if (Number.isFinite(parsed)) {
                      setCoordinates((previous) => [parsed, previous[1]]);
                    }
                  }}
                  disabled={isPending}
                  placeholder="Enter the latitude"
                  className="h-10 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-2 text-xs placeholder:text-[#98a4b7] sm:h-9"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-text-strong sm:text-base">
                  Longitude
                </span>
                <Input
                  value={longitudeInput}
                  onChange={(event) => {
                    const value = event.target.value;
                    setLongitudeInput(value);

                    const parsed = Number.parseFloat(value);

                    if (Number.isFinite(parsed)) {
                      setCoordinates((previous) => [previous[0], parsed]);
                    }
                  }}
                  disabled={isPending}
                  placeholder="Enter longitude"
                  className="h-10 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-2 text-xs placeholder:text-[#98a4b7] sm:h-9"
                />
              </label>
              
              <div className="col-span-1 sm:col-span-2 mt-2">
                <span className="mb-1 block text-sm font-medium text-text-strong sm:text-base">
                  Preview Image
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isPending}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-[#d8deea] bg-white px-4 text-xs font-medium text-text-strong transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Upload size={16} />
                    Choose Image
                  </button>
                  {previewImage && (
                    <span className="text-xs text-text-weak truncate max-w-50 sm:max-w-75">
                      {previewImage.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="inline-flex h-10 w-full items-center justify-center rounded-sm border border-[#d8deea] bg-white px-4 text-sm font-medium text-text-strong transition-colors hover:bg-gray-50 disabled:opacity-50 sm:h-8 sm:w-auto sm:text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-10 w-full items-center justify-center rounded-sm bg-brand-default px-4 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover disabled:opacity-50 sm:h-8 sm:w-auto sm:text-xs"
              >
                {isPending ? "Adding..." : "Add Location"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
