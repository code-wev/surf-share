"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import PhotoCard, { PhotoItem } from "./photo-card";
import { AlertCircle, ChevronDown, Loader2, Plus, Upload } from "lucide-react";

// Locations

const LOCATIONS = [
  "Teahupo'o, Tahiti",
  "Pipeline, Hawaii",
  "Jeffreys Bay, South Africa",
  "Uluwatu, Bali",
  "Hossegor, France",
  "New York, USA",
  "Sydney, Australia",
  "Tokyo, Japan",
];

// Accepted MIME types for upload
const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

// Unique ID generator for photo items (for demo purposes only)

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Convert a File object to a PhotoItem with preview URL
function toPhotoItem(file: File): PhotoItem {
  return {
    id: uid(),
    file,
    preview: URL.createObjectURL(file),
    location: "",
    price: "",
  };
}

export default function ImageUploadContentPage() {
  const fileInputRef = useRef<HTMLInputElement>(null); // file input for "Browse" button
  const addMoreRef = useRef<HTMLInputElement>(null); // file input for "Add more" button in thumbnail strip

  const [pendingPhotos, setPendingPhotos] = useState<PhotoItem[]>([]); // Upper top strip photos for bulk apply
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [bulkLocation, setBulkLocation] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // ── File ingestion ────────────────────────────────────────────────────────

  // New files stay pending in the top strip until Apply is clicked.
  const addFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) => ACCEPTED_MIME.includes(f.type));
    setPendingPhotos((prev) => [...prev, ...valid.map((f) => toPhotoItem(f))]);
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
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  // ── Per-card operations ───────────────────────────────────────────────────

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updatePhoto = (id: string, field: "location" | "price", value: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // ── Bulk apply ──

  const applyToAllPhotos = () => {
    if (!bulkLocation || !bulkPrice) return;

    if (pendingPhotos.length) {
      // Stage mode - APPLY TO ONLY PENDING PHOTOS
      setPhotos((prev) => [
        ...prev,
        ...pendingPhotos.map((p) => ({ ...p, location: bulkLocation, price: bulkPrice })),
      ]);
      setPendingPhotos([]);
    } else {
      // No pending files - APPLY TO ALL PHOTOS IN UPLOADED GRID
      setPhotos((prev) => prev.map((p) => ({ ...p, location: bulkLocation, price: bulkPrice })));
    }

    setBulkLocation("");
    setBulkPrice("");
  };

  // ── Upload ──

  const handleUpload = async () => {
    if (!photos.length) return;
    setIsUploading(true);
    try {
      const body = new FormData();
      photos.forEach(({ file, location, price }) => {
        body.append("photos", file);
        body.append("locations", location);
        body.append("prices", price);
      });

      // TODO: replace with your actual endpoint
      // const res = await fetch("/api/photos/upload", { method: "POST", body });
      // const data = await res.json();

      await new Promise((r) => setTimeout(r, 1400));

      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      pendingPhotos.forEach((p) => URL.revokeObjectURL(p.preview));
      setPhotos([]);
      setPendingPhotos([]);
      setBulkLocation("");
      setBulkPrice("");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
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
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
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
            <p className="mt-4 text-xs text-gray-400">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-800">Location</label>
              <div className="relative">
                <select
                  value={bulkLocation}
                  onChange={(e) => setBulkLocation(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2.5 pr-8 pl-3 text-sm text-gray-500 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
                >
                  <option value="">Select location</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
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
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter Price"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
              />
            </div>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-[#c47a1e]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>Note:</strong> Your first 10 uploads require approval. After that, photos go
              live immediately. Watermarks are added automatically.
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
              <div key={p.id} className="relative h-16 w-20 overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={p.preview}
                  alt={p.file.name}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}

            {/* Add more button */}
            <input
              ref={addMoreRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
              className="z-10   flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-[#E7E5E4] text-[#0C3173] transition hover:border-[#0a2463] hover:text-[#0a2463]"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* ── Bulk apply row ── */}
          {hasAnyPhotos && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Apply Location to All Photos
                </label>

                <div className="relative">
                  <select
                    value={bulkLocation}
                    onChange={(e) => setBulkLocation(e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2.5 pr-8 pl-3 text-sm text-gray-500 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
                  >
                    <option value="">Country, City, or Landmark</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
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
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter Price"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyToAllPhotos}
                    disabled={!bulkLocation || !bulkPrice}
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
                    locations={LOCATIONS}
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
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>
            <strong>Note:</strong> Your first 10 uploads require approval. After that, photos go
            live immediately. Watermarks are added automatically.
          </span>
        </p>
      )}

      {/* ── Upload button ── */}
      {hasPhotos && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#0a2463] py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              Upload Photos
              <Upload className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </section>
  );
}
