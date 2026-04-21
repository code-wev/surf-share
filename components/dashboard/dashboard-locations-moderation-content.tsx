"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import AddLocationModal, {
  type AddLocationModalPayload,
} from "@/components/dashboard/locations-moderation/add-location-modal";
import { locationsModerationItems } from "@/components/dashboard/locations-moderation/locations-moderation-data";
import LocationsModerationFeaturedCard from "@/components/dashboard/locations-moderation/locations-moderation-featured-card";
import LocationsModerationSidebar from "@/components/dashboard/locations-moderation/locations-moderation-sidebar";
import type { LocationModerationItem } from "@/components/dashboard/locations-moderation/locations-moderation-types";

const LocationsModerationMap = dynamic(
  () => import("@/components/dashboard/locations-moderation/locations-moderation-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-fill-weak text-sm text-text-weak">
        Loading map...
      </div>
    ),
  },
);

export default function DashboardLocationsModerationContent() {
  const [locations, setLocations] = useState<LocationModerationItem[]>(locationsModerationItems);
  const [searchValue, setSearchValue] = useState("");
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(
    locationsModerationItems[0]?.id ?? null,
  );

  const filteredLocations = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return locations;
    }

    return locations.filter((location) => {
      return (
        location.name.toLowerCase().includes(normalizedSearch) ||
        location.region.toLowerCase().includes(normalizedSearch) ||
        location.country.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [locations, searchValue]);

  const resolvedActiveLocationId = filteredLocations.some(
    (location) => location.id === activeLocationId,
  )
    ? activeLocationId
    : filteredLocations[0]?.id ?? null;

  const activeLocation = useMemo(() => {
    return filteredLocations.find((location) => location.id === resolvedActiveLocationId) ?? null;
  }, [filteredLocations, resolvedActiveLocationId]);

  const addLocationInitialCoordinates: [number, number] = activeLocation?.coordinates ?? [
    -19.2576,
    146.8179,
  ];

  const handleAddLocation = () => {
    setIsAddLocationModalOpen(true);
  };

  const handleCreateLocation = (payload: AddLocationModalPayload) => {
    const resolvedRegion = payload.state || payload.region || "NSW";

    const newLocation: LocationModerationItem = {
      id: `location-${Date.now()}`,
      name: payload.name,
      region: resolvedRegion,
      country: "Australia",
      coordinates: [payload.latitude, payload.longitude],
      photosAvailable: 0,
      previewImage: "/home/latest/latest4.jpg",
      status: "Active",
    };

    setLocations((previous) => [newLocation, ...previous]);
    setActiveLocationId(newLocation.id);
    setSearchValue("");
    setIsAddLocationModalOpen(false);
    toast.success("Location added.");
  };

  const handleEditLocation = (location: LocationModerationItem) => {
    toast.success(`Edit opened for ${location.name}.`);
  };

  const handleDeleteLocation = (location: LocationModerationItem) => {
    setLocations((previous) => previous.filter((item) => item.id !== location.id));
    toast.success(`${location.name} removed.`);
  };

  const handleViewGallery = () => {
    if (!activeLocation) {
      return;
    }

    toast.success(`Opening gallery for ${activeLocation.name}.`);
  };

  return (
    <section className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5 [font-family:var(--font-sf-pro)]">
      <div className="mx-auto w-full max-w-420">
        <h1 className="inline-flex border-b border-brand-default pb-1 text-base font-medium text-brand-default sm:text-lg">
          Locations Moderation
        </h1>

        <div className="mt-4 overflow-hidden bg-surface-muted-100 sm:mt-5 md:mt-9">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr] md:gap-6">
            <div className="relative h-[52vh] min-h-90 w-full overflow-hidden sm:h-[56vh] sm:min-h-105 md:h-[60vh] md:min-h-130 lg:h-[64vh] lg:min-h-145 xl:h-[72vh] xl:min-h-160 2xl:h-[78vh] 2xl:min-h-190">
              <LocationsModerationMap
                locations={filteredLocations}
                activeLocationId={resolvedActiveLocationId}
                onActiveLocationChange={setActiveLocationId}
              />

              {activeLocation ? (
                <LocationsModerationFeaturedCard
                  location={activeLocation}
                  onViewGallery={handleViewGallery}
                />
              ) : (
                <div className="pointer-events-none absolute inset-0 z-600 flex items-center justify-center px-4">
                  <p className="rounded-sm bg-surface-muted-100/95 px-4 py-2 text-sm text-text-weak shadow-sm">
                    No locations match the current search.
                  </p>
                </div>
              )}
            </div>

            <LocationsModerationSidebar
              locations={filteredLocations}
              activeLocationId={resolvedActiveLocationId}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSelectLocation={setActiveLocationId}
              onAddLocation={handleAddLocation}
              onEditLocation={handleEditLocation}
              onDeleteLocation={handleDeleteLocation}
            />
          </div>
        </div>
      </div>

      {isAddLocationModalOpen ? (
        <AddLocationModal
          initialCoordinates={addLocationInitialCoordinates}
          onClose={() => setIsAddLocationModalOpen(false)}
          onSubmit={handleCreateLocation}
        />
      ) : null}
    </section>
  );
}
