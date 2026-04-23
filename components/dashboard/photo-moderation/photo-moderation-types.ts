export type PhotoModerationItem = {
  id: number;
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
};

export type ModerationAction = "approve" | "reject";
