"use client";

import Image from "next/image";
import { Check, AlertCircle, ChevronDown, Plus, Camera, Loader2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ProfileInfoField from "@/components/profile/profile-info-field";
import ProfilePasswordField from "@/components/profile/profile-password-field";
import { Input } from "@/components/ui/input";
import { useAuth, type Session } from "@/lib/auth";
import { getUserById, updateUserById, uploadProfileImage } from "@/src/actions/user.action";
import { changePassword } from "@/src/actions/auth.action";
import { getAbsoluteImageUrl } from "@/lib/utils";

type SocialAccountType = "facebook" | "instagram" | "twitter" | "x";

type SocialAccountLink = {
  id: string;
  type: SocialAccountType;
  url: string;
};

type ProfileApiUser = {
  id?: string;
  name?: string;
  profileImageUrl?: string | null;
  countryName?: string | null;
  phoneNumber?: string | null;
  email?: string;
  address?: string | null;
  promotionEmail?: boolean;
  socialAccounts?: { platform: string; url: string }[];
  paypalEmail?: string | null;
  paypalConnected?: boolean | null;
  manualBankDetails?: string | null;
  subscriptionTier?: string;
};

const SOCIAL_ACCOUNT_TYPES: { value: SocialAccountType; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
];

type ProfileSettingsFormProps = {
  initialProfile: ProfileApiUser;
  session: Session | null;
};

function ProfileSettingsForm({ initialProfile, session }: ProfileSettingsFormProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isContributor = session?.role === "PHOTOGRAPHER";

  // Form values state
  const [formValues, setFormValues] = useState({
    fullName: initialProfile.name || session?.name || "",
    country: initialProfile.countryName || "",
    phone: initialProfile.phoneNumber || "",
    email: initialProfile.email || session?.email || "",
    address: initialProfile.address || "",
    manualBankDetails: initialProfile.manualBankDetails || "",
    paypalEmail: initialProfile.paypalEmail || "",
  });

  const [promotionEmail, setPromotionEmail] = useState<boolean>(
    Boolean(initialProfile.promotionEmail),
  );
  const [isPromotionLoading, setIsPromotionLoading] = useState(false);

  // Social links state
  const incoming = initialProfile.socialAccounts || [];
  const initialSocialLinks: SocialAccountLink[] = incoming.map((s, i) => ({
    id: `${s.platform}-${i}`,
    type: s.platform as SocialAccountType,
    url: s.url,
  }));
  const [socialLinks, setSocialLinks] = useState<SocialAccountLink[]>(initialSocialLinks);
  const [socialType, setSocialType] = useState<SocialAccountType | "">("");
  const [socialUrl, setSocialUrl] = useState("");

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [paypalError, setPaypalError] = useState<string | null>(null);

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving" | "error">("saved");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track last saved values to prevent duplicate requests
  const lastSavedRef = useRef({
    fullName: formValues.fullName,
    country: formValues.country,
    phone: formValues.phone,
    address: formValues.address,
    manualBankDetails: formValues.manualBankDetails,
    paypalEmail: formValues.paypalEmail,
    socialLinks: initialSocialLinks,
  });

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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const performSave = async (
    valuesToSave: typeof formValues,
    linksToSave: SocialAccountLink[],
  ) => {
    if (!session?.id) return;

    // Validation
    const trimmedName = valuesToSave.fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setSaveStatus("unsaved");
      setNameError("Full name must be at least 2 characters");
      return;
    }
    setNameError(null);

    if (isContributor && valuesToSave.paypalEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valuesToSave.paypalEmail.trim())) {
        setSaveStatus("unsaved");
        setPaypalError("Please enter a valid PayPal email address");
        return;
      }
    }
    setPaypalError(null);

    setSaveStatus("saving");

    try {
      const payload: Record<string, unknown> = {
        name: trimmedName,
        countryName: valuesToSave.country.trim() || null,
        phoneNumber: valuesToSave.phone.trim() || null,
        address: valuesToSave.address.trim() || null,
      };

      if (isContributor) {
        payload.manualBankDetails = valuesToSave.manualBankDetails.trim() || null;
        payload.paypalEmail = valuesToSave.paypalEmail.trim() || null;
        payload.paypalConnected = Boolean(valuesToSave.paypalEmail.trim());
        payload.socialAccounts = linksToSave.map((s) => ({
          platform: s.type,
          url: s.url,
        }));
      }

      const result = await updateUserById(session.id, payload);

      if (result.success) {
        lastSavedRef.current = {
          fullName: valuesToSave.fullName,
          country: valuesToSave.country,
          phone: valuesToSave.phone,
          address: valuesToSave.address,
          manualBankDetails: valuesToSave.manualBankDetails,
          paypalEmail: valuesToSave.paypalEmail,
          socialLinks: linksToSave,
        };
        setSaveStatus("saved");

        // Keep React Query cache fresh without re-rendering form inputs
        queryClient.invalidateQueries({
          queryKey: ["profile", session.id],
          refetchType: "none",
        });
        queryClient.invalidateQueries({
          queryKey: ["user", session.id],
          refetchType: "none",
        });
      } else {
        setSaveStatus("error");
        toast.error(result.message || "Failed to auto-save profile changes");
      }
    } catch (error) {
      console.error("Auto-save error:", error);
      setSaveStatus("error");
      toast.error("Failed to auto-save profile changes");
    }
  };

  const triggerSave = (
    nextValues: typeof formValues,
    nextLinks: SocialAccountLink[],
    immediate = false,
  ) => {
    const isChanged =
      nextValues.fullName !== lastSavedRef.current.fullName ||
      nextValues.country !== lastSavedRef.current.country ||
      nextValues.phone !== lastSavedRef.current.phone ||
      nextValues.address !== lastSavedRef.current.address ||
      nextValues.manualBankDetails !== lastSavedRef.current.manualBankDetails ||
      nextValues.paypalEmail !== lastSavedRef.current.paypalEmail ||
      JSON.stringify(nextLinks) !== JSON.stringify(lastSavedRef.current.socialLinks);

    if (!isChanged) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (immediate) {
      performSave(nextValues, nextLinks);
    } else {
      setSaveStatus("unsaved");
      debounceTimerRef.current = setTimeout(() => {
        performSave(nextValues, nextLinks);
      }, 3000);
    }
  };

  const handleFieldChange = (field: keyof typeof formValues, value: string) => {
    const nextValues = { ...formValues, [field]: value };
    setFormValues(nextValues);
    triggerSave(nextValues, socialLinks, false);
  };

  const handleBlur = () => {
    if (saveStatus === "unsaved") {
      triggerSave(formValues, socialLinks, true);
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

  const handleTogglePromotion = async () => {
    if (!session?.id) return;
    const nextValue = !promotionEmail;
    setIsPromotionLoading(true);
    try {
      const result = await updateUserById(session.id, {
        promotionEmail: nextValue,
      });
      if (result.success) {
        setPromotionEmail(nextValue);
        toast.success("Promotion preference updated!");
        await queryClient.invalidateQueries({
          queryKey: ["profile", session.id],
          refetchType: "none",
        });
      } else {
        toast.error(result.message || "Failed to update preference.");
      }
    } catch (error) {
      toast.error("An error occurred.");
      console.error("Error updating promotion preference:", error);
    } finally {
      setIsPromotionLoading(false);
    }
  };

  const addSocialLink = () => {
    const trimmedUrl = socialUrl.trim();
    if (!socialType || !trimmedUrl) return;

    const urlRegex = /^https?:\/\/.+/i;
    if (!urlRegex.test(trimmedUrl)) {
      toast.error("URLs must start with http:// or https://");
      return;
    }

    const newLink: SocialAccountLink = {
      id: `${socialType}-${socialLinks.length}-${trimmedUrl.length}`,
      type: socialType,
      url: trimmedUrl,
    };
    const nextLinks = [...socialLinks, newLink];
    setSocialLinks(nextLinks);
    setSocialType("");
    setSocialUrl("");
    triggerSave(formValues, nextLinks, true);
  };

  const removeSocialLink = (id: string) => {
    const nextLinks = socialLinks.filter((p) => p.id !== id);
    setSocialLinks(nextLinks);
    triggerSave(formValues, nextLinks, true);
  };

  const avatarSrc = initialProfile.profileImageUrl
    ? getAbsoluteImageUrl(initialProfile.profileImageUrl)
    : "/home/logo.png";

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
                  src={avatarSrc}
                  alt="Profile photo"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-brand-default hover:bg-brand-hover absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full text-white cursor-pointer"
              title="Change profile picture"
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
          <div className="mt-4 flex items-center gap-3">
            <p className="text-text-strong text-lg font-medium">
              {formValues.fullName || initialProfile.name}
            </p>
            {isContributor && initialProfile.subscriptionTier && (
              <span className="bg-brand-default text-text-inverse-strong inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm">
                {initialProfile.subscriptionTier.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        {/* Profile Details Header with Real-time Save Status */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 md:mt-9">
          <h2 className="text-text-strong text-[18px] font-semibold">Profile Details</h2>

          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-1 text-xs font-medium text-brand-default animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving changes...</span>
              </span>
            )}
            {saveStatus === "unsaved" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/90 px-3 py-1 text-xs font-medium text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>Unsaved changes...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-medium text-emerald-700">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>All changes saved</span>
              </span>
            )}
            {saveStatus === "error" && (
              <button
                type="button"
                onClick={() => triggerSave(formValues, socialLinks, true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                <span>Save failed &bull; Click to retry</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          <ProfileInfoField
            label="Full name"
            value={formValues.fullName}
            placeholder="Enter your full name"
            onChange={(v: string) => handleFieldChange("fullName", v)}
            onBlur={handleBlur}
            errorMessage={nameError || undefined}
          />
          <ProfileInfoField
            label="Country Name"
            value={formValues.country}
            placeholder="Enter your country"
            onChange={(v: string) => handleFieldChange("country", v)}
            onBlur={handleBlur}
          />
          <ProfileInfoField
            label="Phone Number"
            value={formValues.phone}
            placeholder="Enter your phone number"
            onChange={(v: string) => handleFieldChange("phone", v)}
            onBlur={handleBlur}
          />
          <ProfileInfoField
            label="Email Address"
            value={formValues.email}
            disabled={true}
            helperText="(Cannot be changed)"
          />
          <ProfileInfoField
            label="Address"
            value={formValues.address}
            placeholder="Enter your address"
            onChange={(v: string) => handleFieldChange("address", v)}
            onBlur={handleBlur}
            className="md:col-span-2"
          />

          <div className="flex flex-col gap-2 md:col-span-2">
            <span className="text-text-strong text-base font-medium">Promotions & Updates</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePromotion}
                disabled={isPromotionLoading}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  promotionEmail ? "bg-brand-default" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    promotionEmail ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-text-weak text-sm">Receive Promotional Emails</span>
              {isPromotionLoading && (
                <Loader2 className="text-brand-default h-4 w-4 animate-spin" />
              )}
            </div>
          </div>

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
                    className="border-line-weaker bg-surface-muted-100 text-text-strong focus-visible:ring-brand-default/30 h-11 w-full appearance-none rounded-md border px-3 pr-8 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <option value="">Select Platform</option>
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
                  placeholder="Enter profile link (e.g. https://instagram.com/user)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSocialLink();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={addSocialLink}
                  aria-label="Add social media link"
                  disabled={!socialType || !socialUrl.trim()}
                  className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {socialLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between rounded-md border border-line-weaker bg-surface-muted-100/60 px-3 py-2 text-sm"
                    >
                      <p className="text-text-brand-weak truncate">
                        <span className="text-text-strong font-medium capitalize">
                          {link.type}:
                        </span>{" "}
                        <span className="text-text-weak">{link.url}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(link.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 transition-colors cursor-pointer"
                        title="Remove link"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isContributor && (
            <div className="border-line-weaker mt-4 border-t pt-6 md:col-span-2">
              <span className="text-text-strong mb-2 block text-base font-medium">
                Payouts & Earnings
              </span>
              <div className="mt-4">
                <span className="text-text-strong mb-2 block text-base font-medium">
                  PayPal Account{" "}
                  <span className="text-text-weaker text-sm font-normal">
                    (For automated payouts)
                  </span>
                </span>
                <p className="text-text-weak mb-3 text-sm">
                  Enter the PayPal email address where you would like to receive your earnings
                  automatically when someone buys your photos.
                  <br />
                  <span className="text-xs font-semibold text-brand-default">
                    Note: You can use a verified personal or business PayPal account, but we recommend using a business account for automated payments.
                  </span>
                </p>
                <input
                  type="email"
                  value={formValues.paypalEmail}
                  onChange={(e) => handleFieldChange("paypalEmail", e.target.value)}
                  onBlur={handleBlur}
                  placeholder="photographer@example.com"
                  className="border-line-weaker bg-surface-muted-100 text-text-strong focus-visible:ring-brand-default/30 w-full max-w-md rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none focus:bg-white transition-colors"
                />
                {paypalError && (
                  <span className="mt-1 block text-xs font-medium text-rose-600">{paypalError}</span>
                )}
              </div>

              {/* Manual Bank Details Section */}
              <div className="mt-8">
                <span className="text-text-strong mb-2 block text-base font-medium">
                  Manual Bank Details{" "}
                  <span className="text-text-weaker text-sm font-normal">(Optional)</span>
                </span>
                <p className="text-text-weak mb-3 text-sm">
                  If you prefer not to use PayPal, please provide your local bank details here.
                  Admins will attempt to manually process payments to this account on an adhoc
                  basis.
                </p>
                <textarea
                  value={formValues.manualBankDetails}
                  onChange={(e) => handleFieldChange("manualBankDetails", e.target.value)}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="Account Name: John Doe&#10;BSB: 123-456&#10;Account Number: 12345678"
                  className="border-line-weaker bg-surface-muted-100 text-text-strong focus-visible:ring-brand-default/30 w-full resize-y rounded-md border p-3 text-sm focus-visible:ring-2 focus-visible:outline-none focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
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
                className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-9 cursor-pointer items-center rounded-sm px-6 text-sm font-medium transition-colors disabled:opacity-60"
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

export default function ProfileSettingsContent() {
  const { session } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["profile", session?.id],
    queryFn: async () => {
      if (!session?.id) throw new Error("Missing session user id.");
      return getUserById(session.id);
    },
    enabled: Boolean(session?.id),
  });

  const apiProfile = data?.data as ProfileApiUser | undefined;

  if (isLoading || !apiProfile) {
    return (
      <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-default" />
        </div>
      </div>
    );
  }

  return (
    <ProfileSettingsForm
      key={apiProfile.id || session?.id}
      initialProfile={apiProfile}
      session={session}
    />
  );
}
