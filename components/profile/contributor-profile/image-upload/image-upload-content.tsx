"use client";

import { useLocationsQuery } from "@/hooks/api/useLocations";
import { useUploadPhotosMutation } from "@/hooks/api/usePhotos";
import exifr from "exifr";
import { AlertCircle, ChevronDown, Loader2, Plus, Upload, XIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-handler";
import PhotoCard, { PhotoItem } from "./photo-card";

// Accepted MIME types for upload
const ACCEPTED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Unique ID generator for photo items
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const PHOTO_PRICES = [
  "0.00",
  "2.99",
  "4.99",
  "9.99",
  "14.99",
  "19.99",
  "29.99",
  "39.99",
  "49.99",
];

function toLocalDateInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
}

function toLocalTimeInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${hours}:${minutes}`;
}

function combineDateAndTime(dateValue: string, timeValue: string): Date | null {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function formatDateTimeAsUTC(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}

async function getCaptureDate(file: File): Promise<Date> {
  try {
    const parsedExif = await exifr.parse(file, {
      pick: ["DateTimeOriginal", "CreateDate", "ModifyDate"],
    });

    const rawCaptureDate =
      parsedExif?.DateTimeOriginal || parsedExif?.CreateDate || parsedExif?.ModifyDate;

    if (rawCaptureDate) {
      const captureDate = new Date(rawCaptureDate);
      if (!Number.isNaN(captureDate.getTime())) {
        return captureDate;
      }
    }
  } catch {
    // Fall back to the file's last modified time when EXIF data is unavailable.
  }

  return new Date(file.lastModified);
}

// Convert a File object to a PhotoItem with preview URL
async function toPhotoItem(file: File): Promise<PhotoItem> {
  const captureDate = await getCaptureDate(file);

  return {
    id: uid(),
    title: file.name.split(".")[0] || "Untitled Photo",
    file,
    preview: URL.createObjectURL(file),
    locationId: "",
    price: "",
    capturedDate: toLocalDateInputValue(captureDate),
    capturedTime: toLocalTimeInputValue(captureDate),
  };
}

export default function ImageUploadContentPage() {
  const fileInputRef = useRef<HTMLInputElement>(null); // file input for "Browse" button
  const addMoreRef = useRef<HTMLInputElement>(null); // file input for "Add more" button in thumbnail strip

  const { data: locationsData } = useLocationsQuery({ page: 1, limit: 1000 });
  const uploadMutation = useUploadPhotosMutation();

  const rawLocations = locationsData?.data || [];
  const locations = [...rawLocations].sort((a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name),
  );

  const [pendingPhotos, setPendingPhotos] = useState<PhotoItem[]>([]); // Upper top strip photos for bulk apply
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [bulkLocationId, setBulkLocationId] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── File ingestion ────────────────────────────────────────────────────────

  // New files stay pending in the top strip until Apply is clicked.
  const addFiles = useCallback(async (files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) => ACCEPTED_MIME.includes(f.type));
    if (valid.length !== files.length) {
      toast.error("Some files were skipped. Only JPG, PNG, and WEBP images are allowed.");
    }
    const photoItems = await Promise.all(valid.map((file) => toPhotoItem(file)));
    setPendingPhotos((prev) => [...prev, ...photoItems]);
  }, []);

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) void addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  // ── Per-card operations ───────────────────────────────────────────────────

  const removePendingPhoto = (id: string) => {
    setPendingPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updatePhoto = (
    id: string,
    field: "locationId" | "title" | "price" | "capturedDate" | "capturedTime",
    value: string,
  ) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // ── Bulk Apply ────────────────────────────────────────────────────────────

  const applyToAllPhotos = () => {
    if (!bulkLocationId || !bulkPrice) {
      toast.error("Please select a location and price to apply.");
      return;
    }

    if (pendingPhotos.length === 0) {
      toast.error("Please add photos before applying.");
      return;
    }

    // Move pending photos to the main grid with the selected location & price
    const mapped = pendingPhotos.map((p) => ({
      ...p,
      locationId: bulkLocationId,
      price: bulkPrice,
    }));

    setPhotos((prev) => [...prev, ...mapped]);
    setPendingPhotos([]);
  };

  // ── Upload ────────────────────────────────────────────────────────────────

  const handleUpload = () => {
    if (!photos.length) return;
    setUploadError(null);

    // Validation
    const invalidPhotos = photos.filter(
      (p) => !p.locationId || !p.price || !p.capturedDate || !p.capturedTime || !p.title?.trim(),
    );
    if (invalidPhotos.length > 0) {
      const errorMsg =
        "Please ensure all photos have a title, location, date, time, and price before uploading.";
      toast.error(errorMsg, { duration: 10000 });
      setUploadError(errorMsg);
      return;
    }

    const body = new FormData();
    photos.forEach(({ file, locationId, price, capturedDate, capturedTime, title }) => {
      const capturedAt = combineDateAndTime(capturedDate, capturedTime);

      if (!capturedAt) {
        return;
      }

      body.append("photos", file);
      body.append("locations", locationId);
      body.append("prices", price);
      body.append("capturedAts", formatDateTimeAsUTC(capturedAt));
      body.append("titles", title.trim());
    });

    uploadMutation.mutate(
      {
        payload: body,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      },
      {
        onSuccess: () => {
          photos.forEach((p) => URL.revokeObjectURL(p.preview));
          pendingPhotos.forEach((p) => URL.revokeObjectURL(p.preview));
          setPhotos([]);
          setPendingPhotos([]);
          setBulkLocationId("");
          setBulkPrice("");
          setUploadProgress(0);
          setUploadError(null);
        },
        onError: (err: unknown) => {
          setUploadProgress(0);
          const errorMsg = getErrorMessage(
            err,
            "Failed to upload photos. If the upload is unsuccessful, try batches of 20–30 photos at a time.",
          );
          setUploadError(errorMsg);
        },
      },
    );
  };

  // ── Render ──

  const hasPendingPhotos = pendingPhotos.length > 0;
  const hasPhotos = photos.length > 0;
  const hasAnyPhotos = hasPendingPhotos || hasPhotos;

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page title */}
      <h1 className="inline-flex border-b border-[#0a2463] pb-1 text-base font-medium text-[#0a2463] sm:text-lg">
        Upload New Photo
      </h1>

      {/* ── Empty state / Drop zone ── */}
      {!hasAnyPhotos ? (
        <>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 transition-colors ${
              isDragging ? "border-[#0a2463] bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef1f8]">
              <Upload className="h-6 w-6 text-[#0a2463]" />
            </div>
            <p className="text-center text-sm font-medium text-gray-800">
              Drag &amp; Drop Your Photos
              <br />
              Here
            </p>
            <p className="mt-2 text-xs text-gray-400">Or</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) void addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-md bg-[#0a2463] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Browse Photos
            </button>
            <p className="mt-4 px-2 text-xs text-gray-400">
              Supported formats: JPG, JPEG, PNG, WEBP
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-800">Location</label>
              <div className="relative">
                <select
                  value={bulkLocationId}
                  onChange={(e) => setBulkLocationId(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2.5 pr-8 pl-3 text-sm text-gray-500 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
                >
                  <option value="">Select location</option>
                  {locations.map((loc: { id: string; name: string }) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-800">Price</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-gray-400">
                  $
                </span>
                <select
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2.5 pr-8 pl-8 text-sm text-gray-700 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
                >
                  <option value="">Select price</option>
                  {PHOTO_PRICES.map((price) => (
                    <option key={price} value={price}>
                      {price}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-1 sm:col-span-2">
              <button
                type="button"
                onClick={applyToAllPhotos}
                disabled={!bulkLocationId || !bulkPrice}
                className="min-w-28 rounded-md bg-[#0a2463] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-1.5 text-xs text-[#c47a1e]">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>Note:</strong> Your first 10 uploads require approval. After that, photos go
              live immediately. Watermarks are added automatically. If the upload is unsuccessful,
              try batches of 20–30 photos at a time.
            </span>
          </p>
        </>
      ) : (
        <>
          {/* Thumbnail strip + add more */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-6 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-colors ${
              isDragging ? "border-[#0a2463] bg-blue-50" : ""
            }`}
          >
            {pendingPhotos.map((p) => (
              <div
                key={p.id}
                className="group relative h-16 w-20 overflow-hidden rounded-md bg-gray-100"
              >
                <Image
                  src={p.preview}
                  alt={p.file.name}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePendingPhoto(p.id)}
                  className="absolute top-1 right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-white/80 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:text-red-600"
                >
                  <XIcon className="h-3 w-3" strokeWidth={3} />
                </button>
              </div>
            ))}

            {/* Add more button */}
            <input
              ref={addMoreRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => addMoreRef.current?.click()}
              aria-label="Add more photos"
              className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-[#E7E5E4] text-[#0C3173] transition hover:border-[#0a2463] hover:text-[#0a2463]"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* ── Bulk apply row ── */}
          {hasAnyPhotos && (
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Apply Location to All Photos
                </label>

                <div className="relative">
                  <select
                    value={bulkLocationId}
                    onChange={(e) => setBulkLocationId(e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2.5 pr-8 pl-3 text-sm text-gray-500 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
                  >
                    <option value="">Country, City, or Landmark</option>
                    {locations.map((loc: { id: string; name: string }) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Apply Pricing to All Photos
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-gray-400">
                      $
                    </span>
                    <select
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2.5 pr-8 pl-8 text-sm text-gray-700 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
                    >
                      <option value="">Select price</option>
                      {PHOTO_PRICES.map((price) => (
                        <option key={price} value={price}>
                          {price}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={applyToAllPhotos}
                    disabled={!bulkLocationId || !bulkPrice}
                    className="rounded-md bg-[#0a2463] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Photo cards grid ── */}
          {hasPhotos && (
            <>
              <h2 className="mt-8 text-sm font-semibold text-gray-800">
                Uploaded Photos ({photos.length})
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    locations={locations}
                    onRemove={removePhoto}
                    onChange={updatePhoto}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Note + Upload button (shown once photos are added */}
      {hasPhotos && (
        <p className="mt-6 flex items-start gap-1.5 text-xs text-[#c47a1e]">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            <strong>Note:</strong> Your first 10 uploads require approval. After that, photos go
            live immediately. Watermarks are added automatically. If the upload is unsuccessful,
            try batches of 20–30 photos at a time.
          </span>
        </p>
      )}

      {/* ── Upload button ── */}
      {hasPhotos && (
        <div className="mt-6 flex flex-col items-center">
          {uploadError && (
            <div className="mb-4 flex w-full max-w-xl items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800 shadow-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Upload Issue</p>
                  <p className="mt-0.5 text-red-700">{uploadError}</p>
                  <p className="mt-1 text-xs font-medium text-red-600">
                    Tip: If uploading many high-resolution photos, try uploading in batches of 20–30 photos at a time.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="cursor-pointer p-1 text-red-400 transition-colors hover:text-red-700"
                title="Dismiss warning"
              >
                <XIcon size={16} />
              </button>
            </div>
          )}
          {uploadMutation.isPending && uploadProgress > 0 && (
            <div className="mb-3 flex w-full max-w-md items-center gap-4 rounded-md border border-gray-200 bg-white p-3 shadow-sm">
              <span className="w-12 text-right text-sm font-medium text-gray-700">
                {uploadProgress}%
              </span>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="absolute inset-y-0 left-0 bg-[#0a2463] transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0a2463] py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadProgress === 100 ? "Processing on Server..." : "Uploading…"}
              </>
            ) : (
              <>
                Upload Photos
                <Upload className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
