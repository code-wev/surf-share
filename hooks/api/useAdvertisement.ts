import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { advertisementService } from "../../lib/api/services/advertisement.service";
import { queryKeys } from "../../lib/api/query-keys";
import { getErrorMessage } from "../../lib/utils/error-handler";

export const useAdvertisementQuery = () => {
  return useQuery({
    queryKey: queryKeys.advertisement.detail(),
    queryFn: () => advertisementService.get(),
  });
};

export const useUpsertAdvertisementMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: advertisementService.upsert,
    onSuccess: () => {
      toast.success("Advertisement published successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.advertisement.detail() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to publish advertisement."));
    },
  });
};

export const useDeleteAdvertisementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: advertisementService.delete,
    onSuccess: () => {
      toast.success("Advertisement removed successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.advertisement.detail() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to remove advertisement."));
    },
  });
};
