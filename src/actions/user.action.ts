import { apiClient } from "@/lib/api/client";
import axios, { AxiosError } from "axios";

interface UserGetResponse {
  success: boolean;
  message: string;
  meta?: {
    page?: number;
    limit: number;
    total: number;
    totalPages: number;
    nextCursor?: string | null;
  };
  data?: Array<{
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
    phoneNumber?: string | null;
    role: string;
    status: string;
    photoCount?: number | string | null;
    platformCommission?: number | string | null;
    purchasePhoto?: number | string | null;
    subscriptionTier?: string | null;
    countryName?: string | null;
    address?: string | null;
    promotionEmail: boolean;
  }>;
}

interface UserGetByIdResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string | null;
    phoneNumber?: string | null;
    role: string;
    status: string;
    createdAt: string;
    countryName?: string | null;
    address?: string | null;
    promotionEmail: boolean;
  };
}

interface ApiErrorResponse {
  message: string;
  data?: unknown;
}

/**
 * Get error message from API response
 */
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

/**
 * GET Users
 * @param query - Query parameters for filtering and pagination
 * @returns Promise with success status and message
 */
export const getUsers = async (query: Record<string, unknown>): Promise<UserGetResponse> => {
  try {
    const response = await apiClient.get<UserGetResponse>("/users", { params: query });
    return {
      success: response.data.success,
      message: response.data.message,
      meta: response.data.meta,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const getUserPhotos = async (
  userId: string,
  limit: number = 10,
): Promise<{ success: boolean; data: Array<{ imageUrl: string }> }> => {
  try {
    const response = await apiClient.get(`/photos/${userId}`, { params: { limit } });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching user photos:", error);
    return {
      success: false,
      data: [],
    };
  }
};

/**
 * GET user details by ID
 * @param userId - ID of the user to retrieve
 * @returns Promise with success status and message
 */
export const getUserById = async (userId: string): Promise<UserGetByIdResponse> => {
  try {
    const response = await apiClient.get<UserGetByIdResponse>(`/users/${userId}`);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

/**
 * UPDATE(PATCH) user details by ID
 * @param userId - ID of the user to update
 * @param updateData - Data to update for the user
 */
export const updateUserById = async (
  userId: string,
  updateData: Record<string, unknown>,
): Promise<UserGetByIdResponse> => {
  try {
    const response = await apiClient.patch<UserGetByIdResponse>(`/users/${userId}`, updateData);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const uploadProfileImage = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await apiClient.post(`/users/${userId}/profile-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Upload error details:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Upload error details:", error.message);
    } else {
      console.error("Upload error details:", error);
    }

    throw new Error(getErrorMessage(error));
  }
};
