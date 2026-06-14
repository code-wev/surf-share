import { apiClient } from "../client";
import type { AxiosProgressEvent } from "axios";

export type PhotoStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IPhotoResponse {
  id: string;
  imageUrl: string;
  price: number;
  status: PhotoStatus;
  photographerId: string;
  locationId: string;
  title?: string | null;
  capturedAt?: string | null;
  timeKey?: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  fileSize?: number | null;
  location: {
    id: string;
    name: string;
    state: string;
    region: string;
  };
  photographer?: {
    id: string;
    name: string;
    email: string;
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
  bulkUpload: async ({ payload, onUploadProgress }: { payload: FormData; onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }) => {
    const response = await apiClient.post("/photos/upload", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  },

  getAllPublic: async (params: Record<string, unknown>) => {
    const response = await apiClient.get("/photos", { params });
    return response.data;
  },

  getMyPhotos: async (params: IPhotosQuery) => {
    const response = await apiClient.get("/photos/my-photos", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/photos/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<{ title: string; price: number; locationId: string; capturedAt: string }>,
  ) => {
    const response = await apiClient.patch(`/photos/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/photos/${id}`);
    return response.data;
  },
};
