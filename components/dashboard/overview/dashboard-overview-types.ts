import type { LucideIcon } from "lucide-react";

export type TrendTone = "positive" | "negative";

export type OverviewStat = {
  label: string;
  value: string;
  Icon: LucideIcon;
  trendLabel: string;
  trendTone: TrendTone;
};

export type TopContributor = {
  id: number;
  name: string;
  photosLabel: string;
  earnings: string;
  avatarSrc: string;
};

export type WeeklyUploadBar = {
  dayLabel: string;
  uploads: number;
};
