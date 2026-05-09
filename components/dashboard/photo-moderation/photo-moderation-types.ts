export type PhotoModerationItem = {
  id: string;
  imageSrc: string;
  images: string[];
  title: string;
  priceLabel: string;
  photographer: string;
  location: string;
  imageCount: number;
  dateTaken: string;
  resolution: string;
  format: string;
  size: string;
  submittedAt: string;
  status: string;
  relatedPhotos?: PhotoModerationItem[];
};

export type ModerationAction = "approve" | "reject";
