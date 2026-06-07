import { apiClient } from "../client";
import { IPhotoResponse, IPhotosQuery } from "./photo.service";

export interface IModeratorPhotosMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IModeratorPhotosResponse {
  data: IPhotoResponse[];
  meta: IModeratorPhotosMeta;
}

export const photoService = {
  getModeratorPhotos: async (query: IPhotosQuery) => {
    const response = await apiClient.get<IModeratorPhotosResponse>("/photos/moderator", {
      params: query,
    });
    return response.data;
  },
};
