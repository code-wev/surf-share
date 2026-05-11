// Phase 3: Centralized Query Key Factory
// This ensures query keys are strictly typed and consistent across the application

export const queryKeys = {
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: { role: string; page: number; limit?: number }) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  advertisement: {
    all: ["advertisement"] as const,
    detail: () => [...queryKeys.advertisement.all, "detail"] as const,
  },
  locations: {
    all: ["locations"] as const,
    lists: () => [...queryKeys.locations.all, "list"] as const,
    list: (filters: { search?: string; page: number; limit?: number }) =>
      [...queryKeys.locations.lists(), filters] as const,
    details: () => [...queryKeys.locations.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.locations.details(), id] as const,
  },
  photos: {
    all: ["photos"] as const,
    myPhotos: (filters: { page: number; limit: number; status?: string; locationId?: string }) =>
      [...queryKeys.photos.all, "my", filters] as const,
    details: () => [...queryKeys.photos.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.photos.details(), id] as const,
  },
};
