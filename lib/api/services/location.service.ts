import { apiClient } from "../client";

export const locationService = {
  getAll: async (params: { search?: string; page: number; limit?: number }) => {
    const response = await apiClient.get("/locations", { params });
    return response.data;
  },
  create: async (payload: FormData) => {
    const response = await apiClient.post("/locations", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  update: async (id: string, payload: FormData) => {
    const response = await apiClient.patch(`/locations/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/locations/${id}`);
    return response.data;
  },
};
