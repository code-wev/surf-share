import Image from "next/image";

import DashboardInfoField from "@/components/dashboard/dashboard-info-field";
import DashboardPasswordField from "@/components/dashboard/dashboard-password-field";

const dashboardDefaults = {
  fullName: "Makibul Hossain Tamim",
  country: "Bangladesh",
  phone: "714-242-888",
  email: "info@vividstaffing.com",
  address: "The Mill Suite, Hardmans Business Centre New Hey Hall Road, Rawtenstall, BB4 6HH",
} as const;

export default function DashboardSettingsContent() {
  return (
    <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
      <section className="flex h-full flex-col">
        <h1 className="border-line-weaker text-text-brand-strong inline-flex w-fit border-b pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Dashboard Settings
        </h1>

        <div className="mt-6 md:mt-12">
          <div className="relative">
            <div className="border-line-weaker bg-fill-hover h-25 w-25 overflow-hidden rounded-full border">
              <Image
                src="/home/latest/latest15.jpg"
                alt="Profile photo"
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <p className="text-text-strong mt-4 text-lg font-medium">{dashboardDefaults.fullName}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:mt-9 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          <DashboardInfoField label="Full name" defaultValue={dashboardDefaults.fullName} />
          <DashboardInfoField label="Country Name" defaultValue={dashboardDefaults.country} />
          <DashboardInfoField label="Phone Number" defaultValue={dashboardDefaults.phone} />
          <DashboardInfoField label="Email Address" defaultValue={dashboardDefaults.email} />
          <DashboardInfoField
            label="Address"
            defaultValue={dashboardDefaults.address}
            className="md:col-span-2"
          />
        </div>

        <div className="mt-8 md:mt-12">
          <h2 className="text-text-strong mb-6 text-[22px] font-semibold">Change Password</h2>
          <div className="space-y-5">
            <div>
              <DashboardPasswordField label="Password" placeholder="Type your password" />
            </div>
            <div>
              <DashboardPasswordField label="New Password" placeholder="Type new your password" />
            </div>
            <div>
              <DashboardPasswordField
                label="Confirm New Password"
                placeholder="Confirm your password"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            className="border-line-weaker bg-fill-weak text-text-weak hover:bg-surface-muted-100 inline-flex h-10 items-center rounded-sm border px-4 text-sm font-medium transition-colors"
          >
            Discard
          </button>
          <button
            type="button"
            className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-10 items-center rounded-sm px-4 text-sm font-medium transition-colors"
          >
            Save changes
          </button>
        </div>
      </section>
    </div>
  );
}