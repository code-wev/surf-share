import { apiClient } from "../client";

export const usersService = {
  getAll: async (params: { role: string; page: number; limit?: number }) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },

  updateSubscription: async (userId: string, subscriptionTier: string) => {
    const response = await apiClient.patch(`/users/${userId}/subscription`, {
      subscriptionTier,
    });
    return response.data;
  },

  updateStatus: async (userId: string, status: string) => {
    const response = await apiClient.patch(`/users/${userId}/status`, {
      status,
    });
    return response.data;
  },
};
