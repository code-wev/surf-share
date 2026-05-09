import { apiClient } from "@/lib/api/client";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
  data?: unknown;
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

export const getPhotos = async (query: Record<string, unknown>) => {
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
