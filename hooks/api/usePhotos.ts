import { useMutation, useQueryClient } from "@tanstack/react-query";
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
