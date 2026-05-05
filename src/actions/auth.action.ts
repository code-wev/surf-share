"use client";

import { apiClient } from "@/lib/api/client";
import type { AxiosError } from "axios";

/**
 * Type definitions for API responses
 */
interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    resetToken: string;
  };
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
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
 * Request OTP for password reset
 * @param email - User's email address
 * @returns Promise with success status and message
 */
export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", {
      email: email.toLowerCase(),
    });

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Forgot password error:", errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Verify OTP and get reset token
 * @param email - User's email address
 * @param otp - 6-digit OTP code
 * @returns Promise with reset token if successful
 */
export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    if (!otp || otp.length !== 6) {
      return {
        success: false,
        message: "Please enter a valid 6-digit OTP.",
      };
    }

    const response = await apiClient.post<VerifyOtpResponse>("/auth/verify-otp", {
      email: email.toLowerCase(),
      otp: otp.trim(),
    });

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Verify OTP error:", errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Reset password using reset token
 * @param token - JWT reset token received from OTP verification
 * @param newPassword - New password to set
 * @returns Promise with success status and message
 */
export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<ResetPasswordResponse> => {
  try {
    if (!token) {
      return {
        success: false,
        message: "Invalid reset token. Please start over.",
      };
    }

    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long.",
      };
    }

    const response = await apiClient.post<ResetPasswordResponse>("/auth/reset-password", {
      token,
      newPassword,
    });

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Reset password error:", errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
};
