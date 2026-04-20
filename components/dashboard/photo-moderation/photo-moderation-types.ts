export type PhotoModerationItem = {
  id: number;
  imageSrc: string;
  photographer: string;
  location: string;
  imageCount: number;
  submittedAt: string;
};

export type ModerationAction = "approve" | "reject";
