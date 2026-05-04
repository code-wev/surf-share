"use client";
import DashboardProfileActions from "@/components/dashboard/profile/dashboard-profile-actions";
import {
  dashboardPasswordFields,
} from "@/components/dashboard/profile/dashboard-profile-data";
import DashboardProfileHeader from "@/components/dashboard/profile/dashboard-profile-header";
import DashboardProfilePasswordSection from "@/components/dashboard/profile/dashboard-profile-password-section";
import Image from "next/image";

import { getDemoUserProfile, useAuth } from "@/lib/auth";
import DashboardProfileInfoField from "./profile/dashboard-profile-info-field";

export default function DashboardProfileSettingsContent() {
  const { session } = useAuth();
  const profile = getDemoUserProfile(session);

  if (!profile) {
    return null;
  }

  return (
    <div className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <section className="flex h-full flex-col">
        <DashboardProfileHeader />

        <div className="mt-6 md:mt-12">
          <div className="relative">
            <div className="border-line-weaker bg-fill-hover h-25 w-25 overflow-hidden rounded-full border">
              <Image
                src={profile.avatarSrc}
                alt="Profile photo"
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <p className="text-text-strong mt-4 text-lg font-medium">{profile.fullName}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:mt-9 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          <DashboardProfileInfoField label="Full name" defaultValue={profile.fullName} />
          <DashboardProfileInfoField label="Country Name" defaultValue={profile.country} />
          <DashboardProfileInfoField label="Phone Number" defaultValue={profile.phone} />
          <DashboardProfileInfoField label="Email Address" defaultValue={profile.email} />
          <DashboardProfileInfoField
            label="Address"
            defaultValue={profile.address}
            className="md:col-span-2"
          />
        </div>

        <DashboardProfilePasswordSection fields={dashboardPasswordFields} />

        <DashboardProfileActions />
      </section>
    </div>
  );
}
