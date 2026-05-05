import { apiClient } from "../client";

export const usersService = {
  getAll: async (params: { role: string; page: number; limit?: number }) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },
};
