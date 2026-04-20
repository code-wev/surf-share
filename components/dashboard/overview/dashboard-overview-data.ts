import {
  Clock3,
  Download,
  Images,
  Users,
} from "lucide-react";

import type {
  OverviewStat,
  TopContributor,
} from "@/components/dashboard/overview/dashboard-overview-types";

export const overviewStats: OverviewStat[] = [
  {
    label: "Total Users",
    value: "12",
    Icon: Users,
    trendLabel: "+ 12%",
    trendTone: "positive",
  },
  {
    label: "Total Photos",
    value: "123",
    Icon: Images,
    trendLabel: "+ 12%",
    trendTone: "positive",
  },
  {
    label: "Downloaded Photos",
    value: "85",
    Icon: Download,
    trendLabel: "+ 12%",
    trendTone: "positive",
  },
  {
    label: "Pending photos",
    value: "10",
    Icon: Clock3,
    trendLabel: "+ 12%",
    trendTone: "negative",
  },
];

export const chartLabels = ["Mar 28", "Mar 29", "Mar 30", "Mar 31", "Apr 1", "Apr 2", "Apr 3"];
export const chartValues = [120, 145, 133, 168, 154, 178, 156];
export const yTicks = [0, 45, 90, 135, 180];

export const topContributors: TopContributor[] = Array.from({ length: 7 }).map((_, index) => ({
  id: index,
  name: "Sarah Chen",
  photosLabel: "247 photos",
  earnings: "$12,450",
  avatarSrc: "/home/latest/latest1.jpg",
}));
