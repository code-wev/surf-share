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
    <div className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
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