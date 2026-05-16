import { apiClient } from "@/lib/api/client";

export const getMyOrders = async () => {
  try {
    const response = await apiClient.get("/orders/my-orders");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};
