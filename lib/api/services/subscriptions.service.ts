import { apiClient } from "../client";

export type ISubscriptionTier = "BRONZE" | "SILVER" | "GOLD";

export interface ISubscriptionConfig {
  id: string;
  tier: ISubscriptionTier;
  photographerSplit: number;
  platformSplit: number;
  maxPrice: number | null;
  dailyUploadLimit: number | null;
  requiresApproval: boolean;
  updatedAt: string;
}

export interface ISubscriptionUpdatePayload {
  photographerSplit?: number;
  platformSplit?: number;
  maxPrice?: number | null;
  dailyUploadLimit?: number | null;
  requiresApproval?: boolean;
}

export const subscriptionsService = {
  getAll: async () => {
    const response = await apiClient.get<{ data: ISubscriptionConfig[] }>("/subscriptions");
    return response.data;
  },

  update: async (tier: ISubscriptionTier, payload: ISubscriptionUpdatePayload) => {
    const response = await apiClient.patch<{ data: ISubscriptionConfig }>(
      `/subscriptions/${tier}`,
      payload,
    );
    return response.data;
  },
};
