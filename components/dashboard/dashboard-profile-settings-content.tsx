"use client";

import DashboardProfileHeader from "@/components/dashboard/profile/dashboard-profile-header";
import DashboardProfilePasswordSection from "@/components/dashboard/profile/dashboard-profile-password-section";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { getDemoUserProfile, useAuth } from "@/lib/auth";
import { getUserById, updateUserById } from "@/src/actions/user.action";
import DashboardProfileInfoField from "./profile/dashboard-profile-info-field";

export default function DashboardProfileSettingsContent() {
  const { session } = useAuth();
  const profile = getDemoUserProfile(session);
  const queryClient = useQueryClient();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editValues, setEditValues] = useState<{
    fullName: string;
    country: string;
    phone: string;
    email: string;
    address: string;
  } | null>(null);

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
    : profile;

  if (!displayProfile) {
    return (
      <div className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
        <div className="flex items-center justify-center py-12">
          <p className="text-text-weak">Loading profile...</p>
        </div>
      </div>
    );
  }

  // The values shown in the fields (editValues when editing, displayProfile otherwise)
  const fieldValues = isEditingProfile && editValues ? editValues : displayProfile;

  const handleEditProfile = () => {
    setEditValues({
      fullName: displayProfile.fullName,
      country: displayProfile.country,
      phone: displayProfile.phone,
      email: displayProfile.email,
      address: displayProfile.address,
    });
    setIsEditingProfile(true);
  };

  const handleDiscardProfile = () => {
    setEditValues(null);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!session?.id || !editValues) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const result = await updateUserById(session.id, {
        name: editValues.fullName,
        countryName: editValues.country,
        phoneNumber: editValues.phone,
        address: editValues.address,
      });

      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        await queryClient.invalidateQueries({
          queryKey: ["dashboard-profile", session.id],
        });
        setIsEditingProfile(false);
        setEditValues(null);
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update profile" });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _error = error;
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (
    field: "fullName" | "country" | "phone" | "email" | "address",
    value: string,
  ) => {
    setEditValues((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

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

        {/* Profile Details Section Header with Edit / Save */}
        <div className="mt-6 flex items-center justify-between md:mt-9">
          <h2 className="text-text-strong text-[18px] font-semibold">Profile Details</h2>

          {!isEditingProfile ? (
            <button
              type="button"
              onClick={handleEditProfile}
              className="border-line-weaker bg-fill-weak text-text-weak hover:bg-surface-muted-100 inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border px-4 text-sm font-medium transition-colors"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDiscardProfile}
                disabled={isSaving}
                className="border-line-weaker bg-fill-weak text-text-weak hover:bg-surface-muted-100 inline-flex h-9 items-center rounded-sm border px-4 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-9 items-center rounded-sm px-4 text-sm font-medium transition-colors disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Save changes"}
              </button>
            </div>
          )}
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mt-4 rounded-sm p-3 text-sm font-medium ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          <DashboardProfileInfoField
            label="Full name"
            value={fieldValues.fullName}
            defaultValue={displayProfile.fullName}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("fullName", v)}
          />
          <DashboardProfileInfoField
            label="Country Name"
            value={fieldValues.country}
            defaultValue={displayProfile.country}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("country", v)}
          />
          <DashboardProfileInfoField
            label="Phone Number"
            value={fieldValues.phone}
            defaultValue={displayProfile.phone}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("phone", v)}
          />
          <DashboardProfileInfoField
            label="Email Address"
            value={fieldValues.email}
            defaultValue={displayProfile.email}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("email", v)}
          />
          <DashboardProfileInfoField
            label="Address"
            value={fieldValues.address}
            defaultValue={displayProfile.address}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("address", v)}
            className="md:col-span-2"
          />
        </div>

        <DashboardProfilePasswordSection />

        {/* <DashboardProfileActions /> */}
      </section>
    </div>
  );
}
