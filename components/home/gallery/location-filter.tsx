"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

type LocationHierarchy = {
  [state: string]: {
    [region: string]: { id: string; name: string }[];
  };
};

type Props = {
  hierarchy: LocationHierarchy;
  onSelect: (locationId: string) => void;
  selectedId: string;
};

export default function LocationFilter({ hierarchy, onSelect, selectedId }: Props) {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const states = Object.keys(hierarchy);
  const regions = activeState ? Object.keys(hierarchy[activeState]) : [];
  const spots = activeState && activeRegion ? hierarchy[activeState][activeRegion] : [];

  return (
    <div className="flex items-start">
      {/* Box 4: Spots — leftmost, appears when a region is selected */}
      {activeState && activeRegion && (
        <div className="mr-1 max-h-75 w-48 overflow-y-auto rounded-md border border-(--color-line-weaker) bg-white shadow-lg">
          <div className="border-b border-(--color-line-weaker) px-4 py-2.5">
            <span className="text-sm font-medium text-(--color-text-brand-strong)">
              {activeRegion}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelect(`region:${activeRegion}`)}
            className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
              selectedId === `region:${activeRegion}`
                ? "font-medium text-(--color-text-strong)"
                : "text-(--color-text-weak)"
            }`}
          >
            All Spots in {activeRegion}
          </button>
          {spots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => onSelect(spot.id)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
                selectedId === spot.id
                  ? "font-medium text-(--color-text-strong)"
                  : "text-(--color-text-weak)"
              }`}
            >
              {spot.name}
            </button>
          ))}
        </div>
      )}

      {/* Box 3: Regions — appears when a state is selected */}
      {activeState && (
        <div className="mr-1 max-h-75 w-48 overflow-y-auto rounded-md border border-(--color-line-weaker) bg-white shadow-lg">
          <div className="border-b border-(--color-line-weaker) px-4 py-2.5">
            <span className="text-sm font-medium text-(--color-text-brand-strong)">
              {activeState}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelect(`state:${activeState}`)}
            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
              selectedId === `state:${activeState}`
                ? "font-medium text-(--color-text-brand-strong)"
                : "text-(--color-text-weak)"
            }`}
          >
            All Regions in {activeState}
          </button>
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region === activeRegion ? null : region)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
                activeRegion === region
                  ? "bg-(--color-surface-muted-100) font-medium text-(--color-text-brand-strong)"
                  : "text-(--color-text-weak)"
              }`}
            >
              {region}
              {hierarchy[activeState][region].length > 0 && (
                <ChevronRight size={13} className="shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Box 2: All States — always visible once location is opened (rendered by parent) */}
      <div className="max-h-75 w-48 overflow-y-auto rounded-md border border-(--color-line-weaker) bg-white shadow-lg">
        <div className="border-b border-(--color-line-weaker) px-4 py-2.5">
          <span className="text-sm font-medium text-(--color-text-brand-strong)">All States</span>
        </div>
        <button
          type="button"
          onClick={() => onSelect("all")}
          className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
            selectedId === "all"
              ? "font-medium text-(--color-text-brand-strong)"
              : "text-(--color-text-weak)"
          }`}
        >
          All Locations
        </button>
        {states.map((state) => (
          <button
            key={state}
            type="button"
            onClick={() => {
              setActiveState(state === activeState ? null : state);
              setActiveRegion(null);
            }}
            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
              activeState === state
                ? "bg-(--color-surface-muted-100) font-medium text-(--color-text-brand-strong)"
                : "text-(--color-text-weak)"
            }`}
          >
            {state}
            <ChevronRight size={13} className="shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
