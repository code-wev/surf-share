import { UploadStatus } from "@/components/profile/contributor-profile/my-uploads/my-upload-data";

export type SalesStats = {
  totalEarnings: number;
  totalSales: number;
  totalSoldPhotos: number;
  totalDownloadsCount: number;
  totalPhotos: number;
  pendingPhotos: number;
};

export type SalesItem = {
  id: string;
  photoUrl: string;
  name: string;
  location: string;
  uploadedAt: string;
  priceUsd: number;
  status: UploadStatus;
  commissionUsd: number;
  totalDownloads: number;
  earningsUsd: number;
  resolution?: string;
  format?: string;
  size?: string;
};

export type ChartDataPoint = {
  label: string;
  value: number;
};

export type MySalesResponse = {
  stats: SalesStats;
  items: SalesItem[];
  chartData: ChartDataPoint[];
};
