"use client";

import Image from "next/image";
import { Pencil, ChevronDown, Plus, Camera, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ProfileInfoField from "@/components/profile/profile-info-field";
import ProfilePasswordField from "@/components/profile/profile-password-field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { getUserById, updateUserById, uploadProfileImage } from "@/src/actions/user.action";
import { changePassword } from "@/src/actions/auth.action";
import { getAbsoluteImageUrl } from "@/lib/utils";

type SocialAccountType = "facebook" | "instagram" | "twitter" | "x";

type SocialAccountLink = {
  id: string;
  type: SocialAccountType;
  url: string;
};

const SOCIAL_ACCOUNT_TYPES: { value: SocialAccountType; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
];

export default function ProfileSettingsContent() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [socialType, setSocialType] = useState<SocialAccountType | "">();
  const [socialUrl, setSocialUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialAccountLink[]>([]);

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

  // Password change form state
  const [passwordFormValues, setPasswordFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isContributor = session?.role === "PHOTOGRAPHER";

  const addSocialLink = () => {
    const trimmedUrl = socialUrl.trim();
    if (!socialType || !trimmedUrl) return;

    setSocialLinks((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 10),
        type: socialType,
        url: trimmedUrl,
      },
    ]);

    setSocialType("");
    setSocialUrl("");
  };

  // Fetch user from API
  const { data } = useQuery({
    queryKey: ["profile", session?.id],
    queryFn: async () => {
      if (!session?.id) throw new Error("Missing session user id.");
      return getUserById(session.id);
    },
    enabled: Boolean(session?.id),
  });

  const apiProfile = data?.data;
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.id) return;

    setIsUploading(true);
    try {
      await uploadProfileImage(session.id, file);
      toast.success("Profile image updated successfully!");
      await queryClient.invalidateQueries({
        queryKey: ["profile", session.id],
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

  const displayProfile = {
    fullName: apiProfile?.name ?? session?.name ?? "",
    avatarSrc: apiProfile?.profileImageUrl ? getAbsoluteImageUrl(apiProfile.profileImageUrl) : "",
    country: apiProfile?.countryName ?? "",
    phone: apiProfile?.phoneNumber ?? "",
    email: apiProfile?.email ?? session?.email ?? "",
    address: apiProfile?.address ?? "",
  };

  interface _ApiProfile {
    socialAccounts?: { platform: string; url: string }[];
  }
  const incoming = (apiProfile as unknown as _ApiProfile)?.socialAccounts || [];
  const displaySocialLinks: SocialAccountLink[] =
    socialLinks.length > 0
      ? socialLinks
      : (incoming || []).map((s, i) => ({
          id: `${s.platform}-${i}`,
          type: s.platform as SocialAccountType,
          url: s.url,
        }));

  return (
    <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
      <section className="flex h-full flex-col">
        <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Profile Settings
        </h1>

        <div className="mt-6 md:mt-12">
          <div className="relative inline-block">
            <div className="border-line-weaker bg-fill-hover h-25 w-25 overflow-hidden rounded-full border">
              {isUploading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="text-text-weak h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Image
                  src={displayProfile.avatarSrc}
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
              className="bg-brand-default hover:bg-brand-hover absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full text-white"
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
          <p className="text-text-strong mt-4 text-lg font-medium">{displayProfile.fullName}</p>
        </div>
        
        {/* Profile details section... */}
        <div className="mt-6 flex items-center justify-between md:mt-9">
          <h2 className="text-text-strong text-[18px] font-semibold">Profile Details</h2>

          {!isEditingProfile ? (
            <button
              type="button"
              onClick={() => {
                setEditValues({
                  fullName: displayProfile.fullName,
                  country: displayProfile.country,
                  phone: displayProfile.phone,
                  email: displayProfile.email,
                  address: displayProfile.address,
                });
                setIsEditingProfile(true);
              }}
              className="border-line-weaker bg-fill-weak text-text-weak hover:bg-surface-muted-100 inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border px-4 text-sm font-medium transition-colors"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditValues(null);
                  setIsEditingProfile(false);
                  setMessage(null);
                }}
                disabled={isSaving}
                className="border-line-weaker bg-fill-weak text-text-weak hover:bg-surface-muted-100 inline-flex h-9 items-center rounded-sm border px-4 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!session?.id || !editValues) return;

                  // Validation
                  if (!editValues.fullName.trim()) {
                    setMessage({ type: "error", text: "Full name is required" });
                    return;
                  }
                  if (editValues.fullName.trim().length < 2) {
                    setMessage({ type: "error", text: "Full name must be at least 2 characters" });
                    return;
                  }

                  // Validate social media URLs if any
                  if (displaySocialLinks.length > 0) {
                    const urlRegex = /^https?:\/\/.+/i;
                    for (const link of displaySocialLinks) {
                      if (!urlRegex.test(link.url)) {
                        setMessage({
                          type: "error",
                          text: `Invalid URL for ${link.type}: ${link.url}. URLs must start with http:// or https://`,
                        });
                        return;
                      }
                    }
                  }

                  setIsSaving(true);
                  setMessage(null);
                  try {
                    const payload: Record<string, unknown> = {
                      name: editValues.fullName.trim(),
                      countryName: editValues.country?.trim() || undefined,
                      phoneNumber: editValues.phone?.trim() || undefined,
                      address: editValues.address?.trim() || undefined,
                    };

                    // Remove undefined values
                    Object.keys(payload).forEach(
                      (key) => payload[key] === undefined && delete payload[key],
                    );

                    if (isContributor && displaySocialLinks.length > 0) {
                      payload.socialAccounts = displaySocialLinks.map((s) => ({
                        platform: s.type,
                        url: s.url,
                      }));
                    }

                    const result = await updateUserById(session.id, payload);
                    if (result.success) {
                      setMessage({ type: "success", text: "Profile updated successfully!" });
                      await queryClient.invalidateQueries({ queryKey: ["profile", session.id] });
                      setIsEditingProfile(false);
                      setEditValues(null);
                    } else {
                      setMessage({
                        type: "error",
                        text: result.message || "Failed to update profile",
                      });
                    }
                  } catch (error) {
                    const errorMessage =
                      error instanceof Error
                        ? error.message
                        : "Failed to update profile. Please try again.";
                    setMessage({
                      type: "error",
                      text: errorMessage,
                    });
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-9 items-center rounded-sm px-4 text-sm font-medium transition-colors disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Save changes"}
              </button>
            </div>
          )}
        </div>

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
          <ProfileInfoField
            label="Full name"
            value={isEditingProfile && editValues ? editValues.fullName : displayProfile.fullName}
            defaultValue={displayProfile.fullName}
            isEditing={isEditingProfile}
            onChange={(v: string) =>
              setEditValues((prev) => (prev ? { ...prev, fullName: v } : prev))
            }
          />
          <ProfileInfoField
            label="Country Name"
            value={isEditingProfile && editValues ? editValues.country : displayProfile.country}
            defaultValue={displayProfile.country}
            isEditing={isEditingProfile}
            onChange={(v: string) =>
              setEditValues((prev) => (prev ? { ...prev, country: v } : prev))
            }
          />
          <ProfileInfoField
            label="Phone Number"
            value={isEditingProfile && editValues ? editValues.phone : displayProfile.phone}
            defaultValue={displayProfile.phone}
            isEditing={isEditingProfile}
            onChange={(v: string) => setEditValues((prev) => (prev ? { ...prev, phone: v } : prev))}
          />
          <ProfileInfoField
            label="Email Address"
            value={displayProfile.email}
            defaultValue={displayProfile.email}
            isEditing={false}
          />
          <ProfileInfoField
            label="Address"
            value={isEditingProfile && editValues ? editValues.address : displayProfile.address}
            defaultValue={displayProfile.address}
            isEditing={isEditingProfile}
            onChange={(v: string) =>
              setEditValues((prev) => (prev ? { ...prev, address: v } : prev))
            }
            className="md:col-span-2"
          />

          {isContributor && (
            <div className="md:col-span-2">
              <span className="text-text-strong mb-2 block text-base font-medium">
                Social Media Account
              </span>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)_40px] md:items-center">
                <div className="relative">
                  <select
                    value={socialType}
                    onChange={(event) =>
                      setSocialType(event.target.value as SocialAccountType | "")
                    }
                    className="border-line-weaker bg-surface-muted-100 text-text-weak focus-visible:ring-brand-default/30 h-11 w-full appearance-none rounded-md border px-3 pr-8 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <option value="">Account</option>
                    {SOCIAL_ACCOUNT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-text-weak pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </div>

                <Input
                  value={socialUrl}
                  onChange={(event) => setSocialUrl(event.target.value)}
                  placeholder="Enter profile link"
                />

                <button
                  type="button"
                  onClick={addSocialLink}
                  aria-label="Add social media link"
                  disabled={!socialType || !socialUrl.trim()}
                  className="text-text-weak hover:bg-surface-muted-100 inline-flex h-10 w-10 items-center justify-center gap-x-1 rounded-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-5 w-5" /> <span className="text-[10px]">Add</span>
                </button>
              </div>

              {displaySocialLinks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {displaySocialLinks.map((link) => (
                    <div key={link.id} className="flex items-center gap-3">
                      <p className="text-text-brand-weak text-base">
                        <span className="text-text-brand-strong font-medium">{link.type}:</span>{" "}
                        {link.url}
                      </p>
                      {isEditingProfile && (
                        <button
                          type="button"
                          onClick={() =>
                            setSocialLinks((prev) => prev.filter((p) => p.id !== link.id))
                          }
                          className="text-text-weak text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 md:mt-12">
          <h2 className="text-text-strong mb-6 text-[22px] font-semibold">Change Password</h2>

          {passwordMessage && (
            <div
              className={`mb-6 rounded-sm p-3 text-sm font-medium ${
                passwordMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {passwordMessage.text}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPasswordMessage(null);

              // Validation
              if (!passwordFormValues.currentPassword) {
                setPasswordMessage({ type: "error", text: "Current password is required." });
                return;
              }

              if (!passwordFormValues.newPassword) {
                setPasswordMessage({ type: "error", text: "New password is required." });
                return;
              }

              if (passwordFormValues.newPassword.length < 8) {
                setPasswordMessage({
                  type: "error",
                  text: "Password must be at least 8 characters long.",
                });
                return;
              }

              if (passwordFormValues.newPassword !== passwordFormValues.confirmPassword) {
                setPasswordMessage({ type: "error", text: "Passwords do not match." });
                return;
              }

              setPasswordLoading(true);
              try {
                const result = await changePassword(
                  passwordFormValues.currentPassword,
                  passwordFormValues.newPassword,
                );

                if (result.success) {
                  setPasswordMessage({ type: "success", text: result.message });
                  setPasswordFormValues({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  await queryClient.invalidateQueries({ queryKey: ["profile", session?.id] });
                } else {
                  setPasswordMessage({ type: "error", text: result.message });
                }
              } catch {
                setPasswordMessage({
                  type: "error",
                  text: "Failed to change password. Please try again.",
                });
              } finally {
                setPasswordLoading(false);
              }
            }}
            className="space-y-5"
          >
            <ProfilePasswordField
              label="Current Password"
              placeholder="Enter your current password"
              value={passwordFormValues.currentPassword}
              onChange={(v) => setPasswordFormValues((prev) => ({ ...prev, currentPassword: v }))}
            />
            <ProfilePasswordField
              label="New Password"
              placeholder="Enter your new password"
              value={passwordFormValues.newPassword}
              onChange={(v) => setPasswordFormValues((prev) => ({ ...prev, newPassword: v }))}
            />
            <ProfilePasswordField
              label="Confirm Password"
              placeholder="Confirm your new password"
              value={passwordFormValues.confirmPassword}
              onChange={(v) => setPasswordFormValues((prev) => ({ ...prev, confirmPassword: v }))}
            />

            <div className="mb-10 pt-4">
              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-9 items-center rounded-sm px-6 text-sm font-medium transition-colors disabled:opacity-60"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
