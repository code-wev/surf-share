export type LocationModerationItem = {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: [number, number];
  photosAvailable: number;
  previewImage: string;
  status: "Active" | "Pending";
};
