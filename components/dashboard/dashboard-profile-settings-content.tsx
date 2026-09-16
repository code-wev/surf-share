"use client";

import DashboardProfileHeader from "@/components/dashboard/profile/dashboard-profile-header";
import DashboardProfilePasswordSection from "@/components/dashboard/profile/dashboard-profile-password-section";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { Camera, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth, type Session } from "@/lib/auth";
import { getUserById, updateUserById, uploadProfileImage } from "@/src/actions/user.action";
import DashboardProfileInfoField from "./profile/dashboard-profile-info-field";
import { getAbsoluteImageUrl } from "@/lib/utils";

type DashboardProfileApiUser = {
  id?: string;
  name?: string;
  email?: string;
  profileImageUrl?: string | null;
  phoneNumber?: string | null;
  countryName?: string | null;
  address?: string | null;
  role?: string;
  status?: string;
};

type DashboardProfileSettingsFormProps = {
  initialProfile: DashboardProfileApiUser;
  session: Session | null;
};

function DashboardProfileSettingsForm({
  initialProfile,
  session,
}: DashboardProfileSettingsFormProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form values state
  const [formValues, setFormValues] = useState({
    fullName: initialProfile.name || session?.name || "",
    country: initialProfile.countryName || "",
    phone: initialProfile.phoneNumber || "",
    email: initialProfile.email || session?.email || "",
    address: initialProfile.address || "",
  });

  // Validation
  const [nameError, setNameError] = useState<string | null>(null);

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving" | "error">("saved");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track last saved values
  const lastSavedRef = useRef({
    fullName: formValues.fullName,
    country: formValues.country,
    phone: formValues.phone,
    address: formValues.address,
  });

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const performSave = async (valuesToSave: typeof formValues) => {
    if (!session?.id) return;

    // Validation
    const trimmedName = valuesToSave.fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setSaveStatus("unsaved");
      setNameError("Full name must be at least 2 characters");
      return;
    }
    setNameError(null);

    setSaveStatus("saving");

    try {
      const payload: Record<string, unknown> = {
        name: trimmedName,
        countryName: valuesToSave.country.trim() || null,
        phoneNumber: valuesToSave.phone.trim() || null,
        address: valuesToSave.address.trim() || null,
      };

      const result = await updateUserById(session.id, payload);

      if (result.success) {
        lastSavedRef.current = {
          fullName: valuesToSave.fullName,
          country: valuesToSave.country,
          phone: valuesToSave.phone,
          address: valuesToSave.address,
        };
        setSaveStatus("saved");

        // Keep React Query cache fresh without re-rendering form inputs
        queryClient.invalidateQueries({
          queryKey: ["dashboard-profile", session.id],
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

  const triggerSave = (nextValues: typeof formValues, immediate = false) => {
    const isChanged =
      nextValues.fullName !== lastSavedRef.current.fullName ||
      nextValues.country !== lastSavedRef.current.country ||
      nextValues.phone !== lastSavedRef.current.phone ||
      nextValues.address !== lastSavedRef.current.address;

    if (!isChanged) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (immediate) {
      performSave(nextValues);
    } else {
      setSaveStatus("unsaved");
      debounceTimerRef.current = setTimeout(() => {
        performSave(nextValues);
      }, 3000);
    }
  };

  const handleFieldChange = (field: keyof typeof formValues, value: string) => {
    const nextValues = { ...formValues, [field]: value };
    setFormValues(nextValues);
    triggerSave(nextValues, false);
  };

  const handleBlur = () => {
    if (saveStatus === "unsaved") {
      triggerSave(formValues, true);
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

  const avatarSrc = initialProfile.profileImageUrl
    ? getAbsoluteImageUrl(initialProfile.profileImageUrl)
    : "/home/logo.png";

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
              className="bg-brand-default hover:bg-brand-hover absolute right-1 bottom-1 flex h-8 w-8 items-center justify-center rounded-full text-white cursor-pointer"
              title="Change profile photo"
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
          <p className="text-text-strong mt-4 text-lg font-medium">
            {formValues.fullName || initialProfile.name}
          </p>
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
                onClick={() => triggerSave(formValues, true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                <span>Save failed &bull; Click to retry</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          <DashboardProfileInfoField
            label="Full name"
            value={formValues.fullName}
            placeholder="Enter your full name"
            onChange={(v: string) => handleFieldChange("fullName", v)}
            onBlur={handleBlur}
            errorMessage={nameError || undefined}
          />
          <DashboardProfileInfoField
            label="Country Name"
            value={formValues.country}
            placeholder="Enter your country"
            onChange={(v: string) => handleFieldChange("country", v)}
            onBlur={handleBlur}
          />
          <DashboardProfileInfoField
            label="Phone Number"
            value={formValues.phone}
            placeholder="Enter your phone number"
            onChange={(v: string) => handleFieldChange("phone", v)}
            onBlur={handleBlur}
          />
          <DashboardProfileInfoField
            label="Email Address"
            value={formValues.email}
            disabled={true}
            helperText="(Cannot be changed)"
          />
          <DashboardProfileInfoField
            label="Address"
            value={formValues.address}
            placeholder="Enter your address"
            onChange={(v: string) => handleFieldChange("address", v)}
            onBlur={handleBlur}
            className="md:col-span-2"
          />
        </div>

        <DashboardProfilePasswordSection />
      </section>
    </div>
  );
}

export default function DashboardProfileSettingsContent() {
  const { session } = useAuth();

  // Fetch User by ID from API
  const { data, isLoading } = useQuery({
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

  if (isLoading || !displayProfile) {
    return (
      <div className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-default" />
        </div>
      </div>
    );
  }

  return (
    <DashboardProfileSettingsForm
      key={displayProfile.id || session?.id}
      initialProfile={displayProfile}
      session={session}
    />
  );
}
