import DashboardProfileActions from "@/components/dashboard/profile/dashboard-profile-actions";
import {
  dashboardPasswordFields,
  dashboardProfileDefaults,
} from "@/components/dashboard/profile/dashboard-profile-data";
import DashboardProfileHeader from "@/components/dashboard/profile/dashboard-profile-header";
import DashboardProfileIdentity from "@/components/dashboard/profile/dashboard-profile-identity";
import DashboardProfileInfoGrid from "@/components/dashboard/profile/dashboard-profile-info-grid";
import DashboardProfilePasswordSection from "@/components/dashboard/profile/dashboard-profile-password-section";

export default function DashboardProfileSettingsContent() {
  return (
    <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
      <section className="flex h-full flex-col">
        <DashboardProfileHeader />

        <DashboardProfileIdentity fullName={dashboardProfileDefaults.fullName} />

        <DashboardProfileInfoGrid defaults={dashboardProfileDefaults} />

        <DashboardProfilePasswordSection fields={dashboardPasswordFields} />

        <DashboardProfileActions />
      </section>
    </div>
  );
}