import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { photoService } from "../../lib/api/services/photo.service";
import { photoService as moderatorPhotoService } from "../../lib/api/services/photo-moderator.service";
import { queryKeys } from "../../lib/api/query-keys";
import { getErrorMessage } from "../../lib/utils/error-handler";

export const useUploadPhotosMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: photoService.bulkUpload,
    onSuccess: () => {
      toast.success("Photos uploaded successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.photos.all });
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(
          error,
          "Failed to upload photos. If the upload is unsuccessful, try batches of 20–30 photos at a time.",
        ),
        {
          duration: 12000,
        },
      );
    },
  });
};

export const usePublicPhotosQuery = (filters: Record<string, unknown>) => {
  return useQuery({
    queryKey: [...queryKeys.photos.all, filters],
    queryFn: () => photoService.getAllPublic(filters),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMyPhotosQuery = (filters: { page: number; limit: number; status?: string; locationId?: string }) => {
  return useQuery({
    queryKey: queryKeys.photos.myPhotos(filters),
    queryFn: () => photoService.getMyPhotos(filters),
    placeholderData: keepPreviousData,
  });
};

export const useModeratorPhotosQuery = (filters: { page: number; limit: number; status?: string; locationId?: string; photographerId?: string }) => {
  return useQuery({
    queryKey: ["moderator-photos", filters],
    queryFn: () => moderatorPhotoService.getModeratorPhotos(filters),
    placeholderData: keepPreviousData,
  });
};

export const usePhotoDetailQuery = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.photos.detail(id),
    queryFn: () => photoService.getById(id),
    enabled: !!id && (options?.enabled ?? true),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdatePhotoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<{ title: string; price: number; locationId: string; capturedAt: string; timeKey: string }>;
    }) => photoService.update(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Photo updated successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.photos.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.photos.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["moderator-photos"] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update photo."));
    },
  });
};

export const useDeletePhotoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: photoService.delete,
    onSuccess: () => {
      toast.success("Photo deleted successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.photos.all });
      queryClient.invalidateQueries({ queryKey: ["pending-photos"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-photos"] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete photo."));
    },
  });
};
