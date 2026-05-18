import { ApiResponse } from "@/types";
import { MySalesResponse } from "@/types/sales.types";
import { apiClient } from "../client";

export const SalesService = {
  getMySales: async (locationId?: string) => {
    const response = await apiClient.get<ApiResponse<MySalesResponse>>("/sales/my-sales", {
      params: { locationId },
    });
    return response.data.data;
  },
};
