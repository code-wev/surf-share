export type LocationModerationItem = {
  id: string;
  name: string;
  parentSpot?: string | null;
  region: string;
  state: string;
  coordinates: [number, number];
  photosAvailable: number;
  previewImage: string;
};
