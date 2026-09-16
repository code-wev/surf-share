import { apiClient } from "../client";

export type PurchaseStatus = "PAID" | "PENDING" | "FAILED";

export interface PurchaseBuyer {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: string;
}

export interface PurchasePhotographer {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
}

export interface PurchaseLocation {
  id: string;
  name: string;
  region: string;
  state: string;
}

export interface PurchasePhoto {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  capturedAt: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  location: PurchaseLocation | null;
  photographer: PurchasePhotographer;
}

export interface PurchaseLogItem {
  id: string;
  orderId: string;
  paypalOrderId: string | null;
  orderStatus: PurchaseStatus;
  purchaseDate: string;
  price: number;
  photographerEarnings: number;
  platformFee: number;
  payoutStatus: "PENDING" | "AUTOMATED_SUCCESS" | "MANUAL_SUCCESS";
  buyer: PurchaseBuyer;
  photo: PurchasePhoto;
}

export interface PurchaseStats {
  totalCompletedPurchases: number;
  totalGrossVolume: number;
  totalPlatformFees: number;
  totalPhotographerEarnings: number;
  totalUniqueBuyers: number;
}

export interface PurchaseLogsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PurchaseLogsData {
  purchases: PurchaseLogItem[];
  stats: PurchaseStats;
}

export interface PurchaseLogsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: PurchaseLogsMeta;
  data: PurchaseLogsData;
}

export const orderService = {
  getAdminPurchases: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const response = await apiClient.get<PurchaseLogsResponse>(
      "/orders/admin/purchases",
      { params }
    );
    return response.data;
  },
};
