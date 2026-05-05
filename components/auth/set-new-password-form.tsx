"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { resetPassword } from "@/src/actions/auth.action";

export function SetNewPasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("resetToken");
    if (!token) {
      router.push("/forgot-password");
    } else {
      setResetToken(token);
    }
  }, [router]);

  const validateForm = (): boolean => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return false;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || !resetToken) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(resetToken, newPassword);

      if (result.success) {
        toast.success(result.message);
        // Clear session storage
        sessionStorage.removeItem("resetToken");
        sessionStorage.removeItem("resetEmail");
        // Redirect to login
        router.push("/login");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 [font-family:var(--font-sf-pro)] sm:mt-10 md:mt-12"
      noValidate
    >
      <div className="space-y-2">
        <label htmlFor="new-password" className="text-text-strong text-base font-medium">
          New Password
        </label>
        <div className="relative">
          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Type your new password"
            className="pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-icon-weaker absolute top-1/2 right-3 -translate-y-1/2"
            aria-label="Toggle new password visibility"
            disabled={isLoading}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        <p className="text-text-weaker text-xs">At least 8 characters</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-new-password" className="text-text-strong text-base font-medium">
          Confirm new password
        </label>
        <div className="relative">
          <Input
            id="confirm-new-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Retype your new password"
            className="pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-icon-weaker absolute top-1/2 right-3 -translate-y-1/2"
            aria-label="Toggle confirm new password visibility"
            disabled={isLoading}
          >
            {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
        <p className="text-text-weak order-2 text-sm md:order-1">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-default font-medium hover:underline">
            Sign Up
          </Link>
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover order-1 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 md:order-2 md:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              Confirm Password
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
