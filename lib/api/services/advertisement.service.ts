import { apiClient } from "../client";

export const advertisementService = {
  get: async () => {
    const response = await apiClient.get("/advertisement");
    return response.data;
  },
  upsert: async (payload: FormData) => {
    const response = await apiClient.post("/advertisement", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  delete: async () => {
    const response = await apiClient.delete("/advertisement");
    return response.data;
  },
};
