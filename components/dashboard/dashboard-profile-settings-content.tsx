"use client";

import DashboardProfileHeader from "@/components/dashboard/profile/dashboard-profile-header";
import DashboardProfilePasswordSection from "@/components/dashboard/profile/dashboard-profile-password-section";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Pencil, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { getUserById, updateUserById, uploadProfileImage } from "@/src/actions/user.action";
import DashboardProfileInfoField from "./profile/dashboard-profile-info-field";
import { getAbsoluteImageUrl } from "@/lib/utils";

export default function DashboardProfileSettingsContent() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const displayProfile = data?.data;

  if (!displayProfile) {
    return (
      <div className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
        <div className="flex items-center justify-center py-12">
          <p className="text-text-weak">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    setEditValues({
      fullName: displayProfile.name,
      country: displayProfile.countryName || "",
      phone: displayProfile.phoneNumber || "",
      email: displayProfile.email,
      address: displayProfile.address || "",
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
    try {
      const result = await updateUserById(session.id, {
        name: editValues.fullName,
        countryName: editValues.country,
        phoneNumber: editValues.phone,
        address: editValues.address,
      });

      if (result.success) {
        toast.success("Profile updated successfully!");
        await queryClient.invalidateQueries({
          queryKey: ["dashboard-profile", session.id],
        });
        setIsEditingProfile(false);
        setEditValues(null);
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.id) return;

    setIsUploading(true);
    try {
      await uploadProfileImage(session.id, file);
      toast.success("Profile image updated successfully!");
      await queryClient.invalidateQueries({
        queryKey: ["dashboard-profile", session.id],
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
          <div className="relative inline-block">
            <div className="border-line-weaker bg-fill-hover h-25 w-25 overflow-hidden rounded-full border">
              {isUploading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="text-text-weak h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Image
                  src={
                    displayProfile.profileImageUrl
                      ? getAbsoluteImageUrl(displayProfile.profileImageUrl)
                      : "/home/logo.png"
                  }
                  alt="Profile photo"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-brand-default hover:bg-brand-hover absolute right-1 bottom-1 flex h-8 w-8 items-center justify-center rounded-full text-white"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-text-strong mt-4 text-lg font-medium">{displayProfile.name}</p>
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

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          <DashboardProfileInfoField
            label="Full name"
            value={isEditingProfile && editValues ? editValues.fullName : displayProfile.name}
            defaultValue={displayProfile.name}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("fullName", v)}
          />
          <DashboardProfileInfoField
            label="Country Name"
            value={isEditingProfile && editValues ? editValues.country : displayProfile.countryName || ""}
            defaultValue={displayProfile.countryName || ""}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("country", v)}
          />
          <DashboardProfileInfoField
            label="Phone Number"
            value={isEditingProfile && editValues ? editValues.phone : displayProfile.phoneNumber || ""}
            defaultValue={displayProfile.phoneNumber || ""}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("phone", v)}
          />
          <DashboardProfileInfoField
            label="Email Address"
            value={isEditingProfile && editValues ? editValues.email : displayProfile.email}
            defaultValue={displayProfile.email}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("email", v)}
          />
          <DashboardProfileInfoField
            label="Address"
            value={isEditingProfile && editValues ? editValues.address : displayProfile.address || ""}
            defaultValue={displayProfile.address || ""}
            isEditing={isEditingProfile}
            onChange={(v: string) => handleFieldChange("address", v)}
            className="md:col-span-2"
          />
        </div>

        <DashboardProfilePasswordSection />
      </section>
    </div>
  );
}
