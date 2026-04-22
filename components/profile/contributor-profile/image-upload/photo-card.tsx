"use client";

import Image from "next/image";
import { CalendarIcon, ChevronDown, FileIcon, HardDriveIcon, XIcon } from "lucide-react";

export interface PhotoItem {
  id: string;
  file: File;
  preview: string;
  location: string;
  price: string;
}

interface PhotoCardProps {
  photo: PhotoItem;
  locations: string[];
  onRemove: (id: string) => void;
  onChange: (id: string, field: "location" | "price", value: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function fileExt(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

export default function PhotoCard({ photo, locations, onRemove, onChange }: PhotoCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-[#EFF6FF] shadow-sm">
      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(photo.id)}
        aria-label="Remove photo"
        className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-red-400 shadow backdrop-blur-sm transition hover:bg-white hover:text-red-600"
      >
        <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>

      {/* Preview */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-100 sm:h-64">
        <Image
          src={photo.preview}
          alt={photo.file.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 120vw, 43vw"
          className="object-cover"
        />
      </div>

      {/* Meta */}
      <div className="p-4">
        {/* File name */}
        <p className="truncate text-xl font-semibold text-gray-900">{photo.file.name}</p>

        {/* Stats row */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#4B5563]">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" color="#020617" />
            {formatDate(new Date(photo.file.lastModified))}
          </span>
          <span className="flex items-center gap-1">
            <FileIcon className="h-3 w-3" color="#020617" />
            {fileExt(photo.file.name)}
          </span>
          <span className="flex items-center gap-1">
            <HardDriveIcon className="h-3 w-3" color="#020617" />
            {formatBytes(photo.file.size)}
          </span>
        </div>

        {/* Location */}
        <div className="mt-4">
          <label className="mb-1 block text-base font-medium text-[#0D1420]">Location</label>
          <div className="relative">
            <select
              value={photo.location}
              onChange={(e) => onChange(photo.id, "location", e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-200 bg-[#EFF6FF] py-2 pr-7 pl-3 text-sm text-gray-700 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-400">
              <ChevronDown className="h-3 w-3" color="#9CA3AF" />
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-3">
          <label className="mb-1 block text-base font-medium text-[#0D1420]">Price</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-gray-400">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={photo.price}
              onChange={(e) => onChange(photo.id, "price", e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-[#EFF6FF] py-2 pr-3 pl-6 text-sm text-gray-700 placeholder-[#9CA3AF] focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
