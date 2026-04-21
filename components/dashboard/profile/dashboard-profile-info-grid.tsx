import type { DashboardProfileDefaults } from "@/components/dashboard/profile/dashboard-profile-types";
import DashboardProfileInfoField from "@/components/dashboard/profile/dashboard-profile-info-field";

type DashboardProfileInfoGridProps = {
  defaults: DashboardProfileDefaults;
};

export default function DashboardProfileInfoGrid({ defaults }: DashboardProfileInfoGridProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:mt-9 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
      <DashboardProfileInfoField label="Full name" defaultValue={defaults.fullName} />
      <DashboardProfileInfoField label="Country Name" defaultValue={defaults.country} />
      <DashboardProfileInfoField label="Phone Number" defaultValue={defaults.phone} />
      <DashboardProfileInfoField label="Email Address" defaultValue={defaults.email} />
      <DashboardProfileInfoField
        label="Address"
        defaultValue={defaults.address}
        className="md:col-span-2"
      />
    </div>
  );
}
