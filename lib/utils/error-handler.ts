import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallbackMessage = "An unexpected error occurred."): string {
  if (isAxiosError(error)) {
    // Check if the backend sent validation error sources
    if (
      error.response?.data?.errorSources &&
      Array.isArray(error.response.data.errorSources) &&
      error.response.data.errorSources.length > 0
    ) {
      return error.response.data.errorSources
        .map((err: { path: string; message: string }) => err.message)
        .join(", ");
    }

    // Check if the backend sent a specific message in the standard format
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // Fallback to standard HTTP status messages if needed
    if (error.response?.status === 401) {
      return "Unauthorized access. Please log in again.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The requested resource was not found.";
    }
    if (error.response?.status && error.response.status >= 500) {
      return "Server error. Please try again later.";
    }
  }

  // Handle native JS Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Return the fallback message if we can't parse the error
  return fallbackMessage;
}
