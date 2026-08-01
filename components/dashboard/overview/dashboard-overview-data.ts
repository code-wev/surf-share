import {
  Camera,
  Clock3,
  DollarSign,
  Download,
  Images,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";

import type {
  OverviewStat,
  TopContributor,
  TopLocation,
  WeeklyUploadBar,
} from "@/components/dashboard/overview/dashboard-overview-types";

export const moderatorOverviewStats: OverviewStat[] = [
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

export const adminOverviewStats: OverviewStat[] = [
  {
    label: "Total Revenue",
    value: "12",
    Icon: DollarSign,
    trendLabel: "+ 12%",
    trendTone: "positive",
  },
  {
    label: "Platform Revenue",
    value: "123",
    Icon: TrendingUp,
    trendLabel: "+ 12%",
    trendTone: "positive",
  },
  {
    label: "Total Active User",
    value: "85",
    Icon: Users,
    trendLabel: "+ 12%",
    trendTone: "positive",
  },
  {
    label: "Total Photographers",
    value: "1",
    Icon: Camera,
    trendLabel: "+ 12%",
    trendTone: "positive",
  },
  {
    label: "Total Location",
    value: "12",
    Icon: MapPin,
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

export function getOverviewStatsByRole(role: "moderator" | "admin") {
  return role === "admin" ? adminOverviewStats : moderatorOverviewStats;
}

export const chartLabels = ["Mar 28", "Mar 29", "Mar 30", "Mar 31", "Apr 1", "Apr 2", "Apr 3"];
export const chartValues = [120, 145, 133, 168, 154, 178, 156];
export const yTicks = [0, 45, 90, 135, 180];

export const weeklyUploadActivityBars: WeeklyUploadBar[] = [
  { dayLabel: "Mon", uploads: 240 },
  { dayLabel: "Tue", uploads: 310 },
  { dayLabel: "Wed", uploads: 290 },
  { dayLabel: "Thu", uploads: 355 },
  { dayLabel: "Fri", uploads: 420 },
  { dayLabel: "Sat", uploads: 510 },
  { dayLabel: "Sun", uploads: 475 },
];

export const weeklyUploadActivityTicks = [0, 150, 300, 450, 600];

export const topContributors: TopContributor[] = Array.from({ length: 7 }).map((_, index) => ({
  id: index,
  name: "Sarah Chen",
  photosLabel: "247 photos",
  earnings: "$12,450",
  avatarSrc: "/home/latest/latest1.jpg",
}));

export const topLocations: TopLocation[] = [
  { id: 1, name: "Banzai, Japan", photosLabel: "1247 photos", progress: 0.93 },
  { id: 2, name: "Tavarua, Fiji", photosLabel: "1247 photos", progress: 0.79 },
  { id: 3, name: "Teahupo'o, Tahiti", photosLabel: "1247 photos", progress: 0.74 },
  { id: 4, name: "Jeffreys Bay, South Africa", photosLabel: "1247 photos", progress: 0.69 },
  { id: 5, name: "Mentawai Islands, Indonesia", photosLabel: "1247 photos", progress: 0.67 },
  { id: 6, name: "Gold Coast, Australia", photosLabel: "1247 photos", progress: 0.65 },
  { id: 7, name: "Huntington Beach, USA", photosLabel: "1247 photos", progress: 0.64 },
  { id: 8, name: "Bundoran, Ireland", photosLabel: "1247 photos", progress: 0.64 },
];
