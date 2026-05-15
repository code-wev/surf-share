import { apiClient } from "../client";

export const checkoutService = {
  createSession: async (photoIds: string[]) => {
    const response = await apiClient.post("/checkout/create-session", { photoIds });
    return response.data;
  },
};
