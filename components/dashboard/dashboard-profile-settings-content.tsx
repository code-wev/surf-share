"use client";
import DashboardProfileActions from "@/components/dashboard/profile/dashboard-profile-actions";
import { dashboardPasswordFields } from "@/components/dashboard/profile/dashboard-profile-data";
import DashboardProfileHeader from "@/components/dashboard/profile/dashboard-profile-header";
import DashboardProfilePasswordSection from "@/components/dashboard/profile/dashboard-profile-password-section";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { getDemoUserProfile, useAuth } from "@/lib/auth";
import { getUserById } from "@/src/actions/user.action";
import DashboardProfileInfoField from "./profile/dashboard-profile-info-field";

export default function DashboardProfileSettingsContent() {
  const { session } = useAuth();
  const profile = getDemoUserProfile(session);

  // Fetch User by ID from API
  const { data } = useQuery({
    queryKey: ["dashboard-profile", session?.id],
    queryFn: async () => {
      if (!session?.id) {
        throw new Error("Missing session user id.");
      }
      return getUserById(session.id);
    },
    enabled: Boolean(session?.id),
  });

  const apiProfile = data?.data;
  const displayProfile = profile
    ? {
        ...profile,
        fullName: apiProfile?.name ?? profile.fullName,
        country: apiProfile?.countryName ?? profile.country,
        phone: apiProfile?.phoneNumber ?? profile.phone,
        email: apiProfile?.email ?? profile.email,
        address: apiProfile?.address ?? profile.address,
      }
    : null;

  if (!displayProfile) {
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
                src={displayProfile.avatarSrc}
                alt="Profile photo"
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <p className="text-text-strong mt-4 text-lg font-medium">{displayProfile.fullName}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:mt-9 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          <DashboardProfileInfoField label="Full name" defaultValue={displayProfile.fullName} />
          <DashboardProfileInfoField label="Country Name" defaultValue={displayProfile.country} />
          <DashboardProfileInfoField label="Phone Number" defaultValue={displayProfile.phone} />
          <DashboardProfileInfoField label="Email Address" defaultValue={displayProfile.email} />
          <DashboardProfileInfoField
            label="Address"
            defaultValue={displayProfile.address}
            className="md:col-span-2"
          />
        </div>

        <DashboardProfilePasswordSection fields={dashboardPasswordFields} />

        <DashboardProfileActions />
      </section>
    </div>
  );
}
