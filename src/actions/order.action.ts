import { apiClient } from "@/lib/api/client";

export const getMyOrders = async () => {
  try {
    const response = await apiClient.get("/orders/my-orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
};
