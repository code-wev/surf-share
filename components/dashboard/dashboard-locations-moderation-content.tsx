"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AddLocationModal, {
  type AddLocationModalPayload,
} from "@/components/dashboard/locations-moderation/add-location-modal";
import LocationsModerationFeaturedCard from "@/components/dashboard/locations-moderation/locations-moderation-featured-card";
import LocationsModerationSidebar from "@/components/dashboard/locations-moderation/locations-moderation-sidebar";
import type { LocationModerationItem } from "@/components/dashboard/locations-moderation/locations-moderation-types";
import { useLocationsQuery, useCreateLocationMutation, useDeleteLocationMutation, useUpdateLocationMutation } from "@/hooks/api/useLocations";
import { getAbsoluteImageUrl } from "@/lib/utils";

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

type ApiLocation = {
  id: string;
  name: string;
  parentSpot: string | null;
  region: string;
  state: string;
  latitude: number;
  longitude: number;
  photosAvailable: number;
  previewImage: string;
};

export default function DashboardLocationsModerationContent() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState<LocationModerationItem | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search value and reset page
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1); // Reset page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading } = useLocationsQuery({
    search: debouncedSearch,
    page: currentPage,
    limit: 5,
  });

  const createMutation = useCreateLocationMutation();
  const updateMutation = useUpdateLocationMutation();
  const deleteMutation = useDeleteLocationMutation();

  const locations: LocationModerationItem[] = useMemo(() => {
    return data?.data?.map((loc: ApiLocation) => ({
      id: loc.id,
      name: loc.name,
      parentSpot: loc.parentSpot,
      region: loc.region,
      state: loc.state,
      coordinates: [loc.latitude, loc.longitude] as [number, number],
      photosAvailable: loc.photosAvailable,
      previewImage: getAbsoluteImageUrl(loc.previewImage),
    })) || [];
  }, [data?.data]);

  const totalPages = data?.meta?.totalPages || 1;

  const resolvedActiveLocationId = locations.some(
    (location) => location.id === activeLocationId,
  )
    ? activeLocationId
    : locations[0]?.id ?? null;

  const activeLocation = useMemo(() => {
    return locations.find((location) => location.id === resolvedActiveLocationId) ?? null;
  }, [locations, resolvedActiveLocationId]);

  const addLocationInitialCoordinates: [number, number] = activeLocation?.coordinates ?? [
    -19.2576,
    146.8179,
  ];

  const handleAddLocation = () => {
    setLocationToEdit(null);
    setIsAddLocationModalOpen(true);
  };

  const handleCreateLocation = (payload: AddLocationModalPayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("parentSpot", payload.parentSpot);
    formData.append("region", payload.region);
    formData.append("state", payload.state);
    formData.append("latitude", payload.latitude.toString());
    formData.append("longitude", payload.longitude.toString());
    if (payload.previewImage) {
      formData.append("previewImage", payload.previewImage);
    }

    if (locationToEdit) {
      updateMutation.mutate({ id: locationToEdit.id, payload: formData }, {
        onSuccess: () => {
          setIsAddLocationModalOpen(false);
          setLocationToEdit(null);
        }
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsAddLocationModalOpen(false);
        }
      });
    }
  };

  const handleEditLocation = (location: LocationModerationItem) => {
    setLocationToEdit(location);
    setIsAddLocationModalOpen(true);
  };

  const handleDeleteLocation = (location: LocationModerationItem) => {
    deleteMutation.mutate(location.id);
  };

  const handleViewGallery = () => {
    if (!activeLocation) {
      return;
    }
    router.push(`/gallery?locationId=${activeLocation.id}`);
  };

  return (
    <section className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5 [font-family:var(--font-sf-pro)]">
      <div className="mx-auto w-full max-w-420">
        <h1 className="inline-flex border-b border-brand-default pb-1 text-base font-medium text-brand-default sm:text-lg">
          Locations Moderation
        </h1>

        <div className="mt-4 overflow-hidden bg-surface-muted-100 sm:mt-5 md:mt-9">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[3fr_1fr] md:gap-6">
            <div className="relative h-[52vh] min-h-90 w-full overflow-hidden sm:h-[56vh] sm:min-h-105 md:h-[60vh] md:min-h-130 lg:h-[64vh] lg:min-h-145 xl:h-[72vh] xl:min-h-160 2xl:h-[78vh] 2xl:min-h-190">
              <LocationsModerationMap
                locations={locations}
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
                    {isLoading ? "Loading locations..." : "No locations match the current search."}
                  </p>
                </div>
              )}
            </div>

            <LocationsModerationSidebar
              locations={locations}
              activeLocationId={resolvedActiveLocationId}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSelectLocation={setActiveLocationId}
              onAddLocation={handleAddLocation}
              onEditLocation={handleEditLocation}
              onDeleteLocation={handleDeleteLocation}
              isPending={deleteMutation.isPending || isLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {isAddLocationModalOpen ? (
        <AddLocationModal
          initialCoordinates={addLocationInitialCoordinates}
          initialLocation={locationToEdit}
          onClose={() => {
            setIsAddLocationModalOpen(false);
            setLocationToEdit(null);
          }}
          onSubmit={handleCreateLocation}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      ) : null}
    </section>
  );
}