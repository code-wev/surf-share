import type { PasswordField } from "@/components/dashboard/profile/dashboard-profile-types";
import DashboardProfilePasswordField from "@/components/dashboard/profile/dashboard-profile-password-field";

type DashboardProfilePasswordSectionProps = {
  fields: PasswordField[];
};

export default function DashboardProfilePasswordSection({
  fields,
}: DashboardProfilePasswordSectionProps) {
  return (
    <div className="mt-8 md:mt-12">
      <h2 className="text-text-strong mb-6 text-[22px] font-semibold">Change Password</h2>
      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.label}>
            <DashboardProfilePasswordField label={field.label} placeholder={field.placeholder} />
          </div>
        ))}
      </div>
    </div>
  );
}
