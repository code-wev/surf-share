import { apiClient } from "../client";

export type PhotoStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IPhotoResponse {
  id: string;
  imageUrl: string;
  price: number;
  status: PhotoStatus;
  photographerId: string;
  locationId: string;
  location: {
    id: string;
    name: string;
    state: string;
    region: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IPhotosQuery {
  page?: number;
  limit?: number;
  status?: string;
  locationId?: string;
}

export const photoService = {
  bulkUpload: async (payload: FormData) => {
    const response = await apiClient.post("/photos/bulk", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getMyPhotos: async (params: IPhotosQuery) => {
    const response = await apiClient.get("/photos/my-uploads", { params });
    return response.data;
  },
};
