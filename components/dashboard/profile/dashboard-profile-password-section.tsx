"use client";

import DashboardProfilePasswordField from "@/components/dashboard/profile/dashboard-profile-password-field";
import { useState } from "react";
import { changePassword } from "@/src/actions/auth.action";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardProfilePasswordSection() {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formValues.currentPassword) {
      setMessage({ type: "error", text: "Current password is required." });
      return;
    }

    if (!formValues.newPassword) {
      setMessage({ type: "error", text: "New password is required." });
      return;
    }

    if (formValues.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    if (formValues.newPassword !== formValues.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    try {
      const result = await changePassword(formValues.currentPassword, formValues.newPassword);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setFormValues({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Invalidate profile query to refresh data
        await queryClient.invalidateQueries({ queryKey: ["dashboard-profile"] });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _error = error;
      setMessage({ type: "error", text: "Failed to change password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 md:mt-12">
      <h2 className="text-text-strong mb-6 text-[22px] font-semibold">Change Password</h2>

      {message && (
        <div
          className={`mb-6 rounded-sm p-3 text-sm font-medium ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <DashboardProfilePasswordField
          label="Current Password"
          placeholder="Enter your current password"
          value={formValues.currentPassword}
          onChange={(v) => handleInputChange("currentPassword", v)}
        />
        <DashboardProfilePasswordField
          label="New Password"
          placeholder="Enter your new password"
          value={formValues.newPassword}
          onChange={(v) => handleInputChange("newPassword", v)}
        />
        <DashboardProfilePasswordField
          label="Confirm Password"
          placeholder="Confirm your new password"
          value={formValues.confirmPassword}
          onChange={(v) => handleInputChange("confirmPassword", v)}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-9 items-center rounded-sm px-6 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
