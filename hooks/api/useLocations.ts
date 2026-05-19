import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { locationService } from "../../lib/api/services/location.service";
import { queryKeys } from "../../lib/api/query-keys";
import { getErrorMessage } from "../../lib/utils/error-handler";

export const useLocationsQuery = (filters: { search?: string; page: number; limit?: number }) => {
  return useQuery({
    queryKey: queryKeys.locations.list(filters),
    queryFn: () => locationService.getAll(filters),
  });
};

export const useAllLocationsQuery = () => {
  return useQuery({
    queryKey: [...queryKeys.locations.all, "all-list"],
    queryFn: async () => {
      const response = await locationService.getAll({ page: 1, limit: 1000 });
      return response.data;
    },
  });
};

export const useCreateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationService.create,
    onSuccess: () => {
      toast.success("Location added successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to add location."));
    },
  });
};

export const useUpdateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) => locationService.update(id, payload),
    onSuccess: () => {
      toast.success("Location updated successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update location."));
    },
  });
};

export const useDeleteLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationService.delete,
    onSuccess: () => {
      toast.success("Location removed successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to remove location."));
    },
  });
};

export const useMapLocationsQuery = () => {
  return useQuery({
    queryKey: [...queryKeys.locations.all, "map-data"],
    queryFn: locationService.getMapData,
  });
};
