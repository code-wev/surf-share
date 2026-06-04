"use client";

import Image from "next/image";
import { CalendarDays, ChevronDown, Clock3, FileIcon, HardDriveIcon, XIcon } from "lucide-react";
import { PHOTO_PRICES } from "./image-upload-content";

export interface PhotoItem {
  id: string;
  title: string;
  file: File;
  preview: string;
  locationId: string;
  price: string;
  capturedDate: string;
  capturedTime: string;
}

interface LocationOption {
  id: string;
  name: string;
}

interface PhotoCardProps {
  photo: PhotoItem;
  locations: LocationOption[];
  onRemove: (id: string) => void;
  onChange: (
    id: string,
    field: "locationId" | "price" | "capturedDate" | "capturedTime" | "title",
    value: string,
  ) => void;
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

function toDateTime(dateValue: string, timeValue: string): Date | null {
  if (!dateValue || !timeValue) {
    return null;
  }

  const dateTime = new Date(`${dateValue}T${timeValue}:00`);
  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
}

function fileExt(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

export default function PhotoCard({ photo, locations, onRemove, onChange }: PhotoCardProps) {
  const capturedAt =
    toDateTime(photo.capturedDate, photo.capturedTime) ?? new Date(photo.file.lastModified);

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
        {/* Title Input */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Enter photo title..."
            value={photo.title}
            onChange={(e) => onChange(photo.id, "title", e.target.value)}
            className="w-full truncate rounded-md border border-transparent bg-transparent px-2 py-1 text-xl font-semibold text-gray-900 transition-colors hover:border-gray-200 focus:border-[#0a2463] focus:bg-white focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
          />
        </div>

        {/* Stats row */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#4B5563]">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" color="#020617" />
            {formatDate(capturedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 className="h-3 w-3" color="#020617" />
            {capturedAt.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
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
              value={photo.locationId}
              onChange={(e) => onChange(photo.id, "locationId", e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-200 bg-[#EFF6FF] py-2 pr-7 pl-3 text-sm text-gray-700 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-400">
              <ChevronDown className="h-3 w-3" color="#9CA3AF" />
            </span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-base font-medium text-[#0D1420]">Date</label>
            <input
              type="date"
              value={photo.capturedDate}
              onChange={(e) => onChange(photo.id, "capturedDate", e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-[#EFF6FF] px-3 py-2 text-sm text-gray-700 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-base font-medium text-[#0D1420]">Time</label>
            <input
              type="time"
              value={photo.capturedTime}
              onChange={(e) => onChange(photo.id, "capturedTime", e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-[#EFF6FF] px-3 py-2 text-sm text-gray-700 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
            />
          </div>
        </div>

        {/* Price */}
        <div className="mt-3">
          <label className="mb-1 block text-base font-medium text-[#0D1420]">Price</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-gray-400">
              $
            </span>
            <select
              value={photo.price}
              onChange={(e) => onChange(photo.id, "price", e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-200 bg-[#EFF6FF] py-2 pr-7 pl-6 text-sm text-gray-700 focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none"
            >
              <option value="">Select price</option>
              {PHOTO_PRICES.map((priceOption) => (
                <option key={priceOption} value={priceOption}>
                  {priceOption}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-400">
              <ChevronDown className="h-3 w-3" color="#9CA3AF" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
