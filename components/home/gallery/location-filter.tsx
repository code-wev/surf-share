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

  return (
    <div className="max-h-75 w-full overflow-y-auto">
      {/* States */}
      {Object.keys(hierarchy).map((state) => (
        <div key={state}>
          <button
            type="button"
            className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
              activeState === state
                ? "font-medium text-(--color-text-brand-strong)"
                : "text-(--color-text-weak)"
            }`}
            onClick={() => {
              setActiveState(state === activeState ? null : state);
              setActiveRegion(null);
            }}
          >
            {state}
            <ChevronRight
              size={14}
              className={`transition-transform ${activeState === state ? "rotate-90" : ""}`}
            />
          </button>

          {/* Regions — shown inline under their state */}
          {activeState === state && (
            <div>
              {Object.entries(hierarchy[state]).map(([region, spots]) => (
                <div key={region}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between py-2.5 pr-4 pl-7 text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
                      activeRegion === region
                        ? "font-medium text-(--color-text-brand-strong)"
                        : "text-(--color-text-weak)"
                    }`}
                    onClick={() => {
                      setActiveRegion(region === activeRegion ? null : region);
                    }}
                  >
                    {region}
                    <ChevronRight
                      size={13}
                      className={`transition-transform ${activeRegion === region ? "rotate-90" : ""}`}
                    />
                  </button>

                  {/* Spots — shown inline under their region */}
                  {activeRegion === region && (
                    <div>
                      {spots.map((spot) => (
                        <button
                          key={spot.id}
                          type="button"
                          className={`w-full py-2 pr-4 pl-11 text-left text-sm transition-colors hover:bg-(--color-surface-muted-100) ${
                            selectedId === spot.id
                              ? "font-medium text-(--color-text-strong)"
                              : "text-(--color-text-weak)"
                          }`}
                          onClick={() => onSelect(spot.id)}
                        >
                          {spot.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
