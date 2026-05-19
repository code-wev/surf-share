import { apiClient } from "../client";

export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data.data;
  },
};
