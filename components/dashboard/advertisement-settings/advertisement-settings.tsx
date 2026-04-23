"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Loader2, Upload, ExternalLink, X } from "lucide-react";

export interface PhotoItem {
  id: string;
  file: File;
  preview: string;
}

// Unique ID generator
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Convert File to PhotoItem
function toPhotoItem(file: File): PhotoItem {
  return {
    id: uid(),
    file,
    preview: URL.createObjectURL(file),
  };
}

export default function AdvertisementSettingsContent() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<PhotoItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [advertisementURL, setAdvertisementURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Add single file
  const addFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        // Clean up old preview if exists
        if (photo) {
          URL.revokeObjectURL(photo.preview);
        }
        setPhoto(toPhotoItem(file));
        setIsPublished(false); // Reset published state when new image is uploaded
      }
    },
    [photo],
  );

  // Handle file input change
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        addFile(file);
      }
      e.target.value = "";
    },
    [addFile],
  );

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
      const file = e.dataTransfer.files?.[0];
      if (file) addFile(file);
    },
    [addFile],
  );

  // Remove photo
  const removePhoto = () => {
    if (photo) {
      URL.revokeObjectURL(photo.preview);
      setPhoto(null);
      setAdvertisementURL("");
      setIsPublished(false);
    }
  };

  // Publish button - uploads the photo
  const handlePublish = async () => {
    if (!photo || !advertisementURL) return;
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append("photo", photo.file);
      body.append("advertisementURL", advertisementURL);

      // TODO: replace with your actual endpoint
      // const res = await fetch("/api/advertisement/upload", { method: "POST", body });

      await new Promise((r) => setTimeout(r, 1400));

      setIsPublished(true);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="inline-flex border-b border-[#0a2463] pb-1 text-base font-medium text-[#0a2463] sm:text-lg">
        Advertisement Settings
      </h1>

      {/* Image Upload Section */}
      {!photo ? (
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
            Drag & Drop Advertisement Banner/Poster
            <br />
            Here
          </p>
          <p className="mt-2 text-xs text-gray-400">Or</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-md bg-[#0a2463] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Upload From Computer
          </button>
          <p className="mt-4 text-xs text-gray-400">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
          </p>
        </div>
      ) : (
        <>
          {/* Image Card */}
          <div className="mt-6">
            <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-[#EFF6FF] shadow-sm">
              {/* Remove button */}
              <button
                type="button"
                onClick={removePhoto}
                aria-label="Remove photo"
                className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-red-400 shadow backdrop-blur-sm transition hover:bg-white hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Preview */}
              <div className="relative h-53 w-full overflow-hidden bg-gray-100 md:h-92">
                <Image
                  src={photo.preview}
                  alt={photo.file.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Meta */}
              <div className="p-4">
                <p className="truncate text-lg font-semibold text-gray-900">{photo.file.name}</p>

                {/* Show URL after publish */}
                {isPublished && (
                  <div className="mt-3">
                    <label className="mb-1 block text-sm font-medium text-[#0D1420]">
                      Advertisement URL
                    </label>
                    <a
                      href={advertisementURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm break-all text-[#0a2463] hover:underline"
                    >
                      {advertisementURL}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Advertisement URL Input */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-gray-800">Advertisement URL</label>
        <input
          type="url"
          placeholder="Enter Advertisement URL"
          value={advertisementURL}
          onChange={(e) => setAdvertisementURL(e.target.value)}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
        />
      </div>

      {/* Publish Button */}
      <button
        type="button"
        onClick={handlePublish}
        disabled={isUploading || !photo || !advertisementURL}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#0a2463] py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publishing..
          </>
        ) : (
          <>
            Publish Advertisement
            <Upload className="h-4 w-4" />
          </>
        )}
      </button>

      {/* After Publish - Show success message */}
      {isPublished && (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-center">
          <p className="text-sm text-green-700">✓ Advertisement published successfully!</p>
        </div>
      )}
    </section>
  );
}
