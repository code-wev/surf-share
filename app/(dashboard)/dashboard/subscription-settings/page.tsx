import DashboardSubscriptionContent from "@/components/dashboard/subscription-settings/dashboard-subscription-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Settings",
  description: "Manage subscription tiers and pricing",
};

export default function SubscriptionSettingsPage() {
  return <DashboardSubscriptionContent />;
}
