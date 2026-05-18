import { apiClient } from "@/lib/api/client";

export const getDownloadablePhotos = async () => {
  try {
    const response = await apiClient.get("/checkout/purchased-photos");
    return response.data;
  } catch (error) {
    console.error("Error fetching downloadable photos:", error);
    throw new Error("Failed to fetch downloadable photos");
  }
};
