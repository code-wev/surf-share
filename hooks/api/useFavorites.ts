import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { favoriteService } from "../../lib/api/services/favorite.service";
import { queryKeys } from "../../lib/api/query-keys";
import { getErrorMessage } from "../../lib/utils/error-handler";

export const useMyFavoritesQuery = () => {
  return useQuery({
    queryKey: queryKeys.favorites.myFavorites(),
    queryFn: () => favoriteService.getMyFavorites(),
  });
};

export const useFavoriteIdsQuery = () => {
  return useQuery({
    queryKey: queryKeys.favorites.ids(),
    queryFn: () => favoriteService.getMyFavoriteIds(),
  });
};

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => favoriteService.toggle(photoId),
    onSuccess: (data) => {
      // Invalidate the favorite lists so they refetch the updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update favorite."));
    },
  });
};
