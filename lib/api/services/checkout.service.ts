import { apiClient } from "../client";

export const checkoutService = {
  createSession: async (photoIds: string[]) => {
    const response = await apiClient.post("/checkout/create-session", { photoIds });
    return response.data;
  },

  retryPayment: async (orderId: string) => {
    const response = await apiClient.post("/checkout/retry-payment", { orderId });
    return response.data;
  },

  verifySession: async (sessionId: string) => {
    const response = await apiClient.get("/checkout/verify-session", {
      params: { sessionId },
    });
    return response.data;
  },

  getPurchasedPhotoIds: async () => {
    const response = await apiClient.get("/checkout/purchased-ids");
    return response.data;
  },
};
