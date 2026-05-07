import { apiClient } from "@/lib/api/client";
import { AxiosError } from "axios";

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
    phoneNumber?: string | null;
    role: string;
    countryName?: string | null;
    address?: string | null;
  }>;
}

interface UserGetByIdResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
    role: string;
    countryName?: string | null;
    address?: string | null;
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
