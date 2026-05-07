import { apiClient } from "../client";

export const photoService = {
  bulkUpload: async (payload: FormData) => {
    const response = await apiClient.post("/photos/bulk", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
