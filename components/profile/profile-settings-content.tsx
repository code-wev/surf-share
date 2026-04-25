"use client";

import Image from "next/image";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

import ProfileInfoField from "@/components/profile/profile-info-field";
import ProfilePasswordField from "@/components/profile/profile-password-field";
import { Input } from "@/components/ui/input";
import { getDemoUserProfile, useDemoAuth } from "@/lib/demo-auth";

type SocialAccountType = "facebook" | "instagram" | "twitter" | "x";

type SocialAccountLink = {
  id: string;
  type: SocialAccountType;
  url: string;
};

const SOCIAL_ACCOUNT_TYPES: { value: SocialAccountType; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "x", label: "X" },
];

export default function ProfileSettingsContent() {
  const { session } = useDemoAuth();
  const profile = getDemoUserProfile(session);
  const [socialType, setSocialType] = useState<SocialAccountType | "">("");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialAccountLink[]>([]);

  const isContributor = session?.role === "contributor";

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

  if (!profile) {
    return null;
  }

  return (
    <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
      <section className="flex h-full flex-col">
        <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Profile Settings
        </h1>

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
          <ProfileInfoField label="Full name" defaultValue={profile.fullName} />
          <ProfileInfoField label="Country Name" defaultValue={profile.country} />
          <ProfileInfoField label="Phone Number" defaultValue={profile.phone} />
          <ProfileInfoField label="Email Address" defaultValue={profile.email} />
          <ProfileInfoField
            label="Address"
            defaultValue={profile.address}
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

              {socialLinks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {socialLinks.map((link) => (
                    <p key={link.id} className="text-text-brand-weak text-base">
                      <span className="text-text-brand-strong font-medium">{link.type}:</span>{" "}
                      {link.url}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 md:mt-12">
          <h2 className="text-text-strong mb-6 text-[22px] font-semibold">Change Password</h2>
          <div className="space-y-5">
            <div>
              <ProfilePasswordField label="Password" placeholder="Type your password" />
            </div>
            <div>
              <ProfilePasswordField label="New Password" placeholder="Type new your password" />
            </div>
            <div>
              <ProfilePasswordField
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
