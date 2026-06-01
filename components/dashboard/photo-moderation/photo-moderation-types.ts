export type PhotoModerationItem = {
  id: string;
  imageSrc: string;
  images: string[];
  title: string;
  priceLabel: string;
  priceValue: number;
  photographer: string;
  location: string;
  locationId: string;
  imageCount: number;
  dateTaken: string;
  uploadedAt: string;
  resolution: string;
  format: string;
  size: string;
  submittedAt: string;
  status: string;
  relatedPhotos?: PhotoModerationItem[];
};

export type ModerationAction = "approve" | "reject" | "edit" | "delete";

