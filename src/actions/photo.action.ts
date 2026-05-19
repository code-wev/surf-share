import { apiClient } from "@/lib/api/client";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
  data?: unknown;
}

export interface PhotoModerationApiPhoto {
  id: string;
  imageUrl: string;
  price: number;
  createdAt: string;
  status: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  fileSize?: number | null;
  photographer?: {
    name?: string | null;
  } | null;
  location?: {
    name?: string | null;
  } | null;
}

export interface ApiListResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if ("response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return axiosError.response?.data?.message || error.message;
    }
    return error.message;
  }
  return "An error occurred. Please try again.";
};

export const getPhotos = async (
  query: Record<string, unknown>,
): Promise<ApiListResponse<PhotoModerationApiPhoto>> => {
  try {
    const response = await apiClient.get("/photos", { params: query });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPhotoById = async (photoId: string) => {
  try {
    const response = await apiClient.get(`/photos/detail/${photoId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updatePhotoStatus = async (photoId: string, status: string) => {
  try {
    const response = await apiClient.patch(`/photos/${photoId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const bulkUpdatePhotoStatus = async (photoIds: string[], status: string) => {
  try {
    const response = await apiClient.post(`/photos/bulk-status`, { photoIds, status });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
