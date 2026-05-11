import { apiClient } from "../client";

export const favoriteService = {
  toggle: async (photoId: string) => {
    const response = await apiClient.post("/favorites/toggle", { photoId });
    return response.data;
  },

  getMyFavorites: async () => {
    const response = await apiClient.get("/favorites");
    return response.data;
  },

  getMyFavoriteIds: async () => {
    const response = await apiClient.get("/favorites/ids");
    return response.data;
  },
};
