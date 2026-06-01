import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { photoService } from "../../lib/api/services/photo.service";
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
      toast.error(getErrorMessage(error, "Failed to upload photos."));
    },
  });
};

export const usePublicPhotosQuery = (filters: Record<string, unknown>) => {
  return useQuery({
    queryKey: [...queryKeys.photos.all, filters],
    queryFn: () => photoService.getAllPublic(filters),
  });
};

export const useMyPhotosQuery = (filters: { page: number; limit: number; status?: string; locationId?: string }) => {
  return useQuery({
    queryKey: queryKeys.photos.myPhotos(filters),
    queryFn: () => photoService.getMyPhotos(filters),
  });
};

export const usePhotoDetailQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.photos.detail(id),
    queryFn: () => photoService.getById(id),
    enabled: !!id,
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
      payload: Partial<{ title: string; price: number; locationId: string; capturedAt: string }>;
    }) => photoService.update(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Photo updated successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.photos.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.photos.detail(variables.id) });
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
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete photo."));
    },
  });
};
