"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type FormEvent } from "react";

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
};

type AddLocationModalProps = {
  initialCoordinates: [number, number];
  onClose: () => void;
  onSubmit: (payload: AddLocationModalPayload) => void;
};

function formatCoordinate(value: number) {
  return value.toFixed(6);
}

export default function AddLocationModal({
  initialCoordinates,
  onClose,
  onSubmit,
}: AddLocationModalProps) {
  const [name, setName] = useState("");
  const [parentSpot, setParentSpot] = useState("");
  const [region, setRegion] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>(initialCoordinates);
  const [latitudeInput, setLatitudeInput] = useState(formatCoordinate(initialCoordinates[0]));
  const [longitudeInput, setLongitudeInput] = useState(formatCoordinate(initialCoordinates[1]));

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const latitude = Number.parseFloat(latitudeInput);
    const longitude = Number.parseFloat(longitudeInput);

    if (!name.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    onSubmit({
      name: name.trim(),
      parentSpot: parentSpot.trim(),
      region: region.trim(),
      state: stateValue.trim(),
      latitude,
      longitude,
    });
  };

  return (
    <div
      className="fixed inset-0 z-1200 flex items-center justify-center bg-black/45 p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-215 overflow-hidden rounded-sm border border-[#d6dde8] bg-[#dde5ef] shadow-[0_26px_70px_rgba(15,23,42,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-60 sm:h-80 p-2 md:p-4 md:h-100">
          <AddLocationMapPicker
            coordinates={coordinates}
            onCoordinatesChange={handleMapCoordinatesChange}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-2 md:p-4 family-[var(--font-sf-pro)]">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-base font-medium text-text-strong">Spot Name</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter the spot name"
                className="h-9 rounded-sm px-2.5 py-1.5 text-xs border-[#d8deea] bg-[#dde5ef] placeholder:text-[#98a4b7]"
              />
            </label>

            <label>
              <span className="mb-1 block text-base font-medium text-text-strong">Parent Spot</span>
              <Input
                value={parentSpot}
                onChange={(event) => setParentSpot(event.target.value)}
                placeholder="Enter the parent spot name"
                className="h-9 rounded-sm px-2.5 py-1.5 text-xs border-[#d8deea] bg-[#dde5ef] placeholder:text-[#98a4b7]"
              />
            </label>

            <label>
              <span className="mb-1 block text-base font-medium text-text-strong">Region</span>
              <Input
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                placeholder="Enter the region"
                className="h-9 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-1.5 text-xs placeholder:text-[#98a4b7]"
              />
            </label>

            <label>
              <span className="mb-1 block text-base font-medium text-text-strong">State</span>
              <Input
                value={stateValue}
                onChange={(event) => setStateValue(event.target.value)}
                placeholder="Enter the state"
                className="h-9 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-1.5 text-xs placeholder:text-[#98a4b7]"
              />
            </label>

            <label>
              <span className="mb-1 block text-base font-medium text-text-strong">Latitude</span>
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
                placeholder="Enter the latitude"
                className="h-9 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-1.5 text-xs placeholder:text-[#98a4b7]"
              />
            </label>

            <label>
              <span className="mb-1 block text-base font-medium text-text-strong">Longitude</span>
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
                placeholder="Enter longitude"
                className="h-9 rounded-sm border-[#d8deea] bg-[#dde5ef] px-2.5 py-1.5 text-xs placeholder:text-[#98a4b7]"
              />
            </label>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex h-8 items-center rounded-sm bg-brand-default px-4 text-xs font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover"
            >
              Add Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
