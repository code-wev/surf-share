"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { useRegisterSurferMutation, useRegisterPhotographerMutation } from "@/hooks/api/useAuth";

export function SignUpForm({
  onAccountTypeChange,
}: {
  onAccountTypeChange?: (value: "surfer" | "photographer") => void;
}) {
  const [accountType, setAccountType] = useState<"surfer" | "photographer">("surfer");
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [promotionEmail, setPromotionEmail] = useState(true);
  const [acceptedApproval, setAcceptedApproval] = useState(false);
  const [acceptedContributor, setAcceptedContributor] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPhotographer = accountType === "photographer";

  const surferMutation = useRegisterSurferMutation();
  const photographerMutation = useRegisterPhotographerMutation();

  const isPending = isPhotographer ? photographerMutation.isPending : surferMutation.isPending;

  const ctaLabel = useMemo(() => {
    return "Sign up";
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // continue to submission

    if (!isPhotographer) {
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }
      surferMutation.mutate({ name, email, password, promotionEmail });
    } else {
      // Photographer registration: require both agreements
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }
      if (!acceptedApproval) {
        toast.error("You must accept the approval requirement.");
        return;
      }
      if (!acceptedContributor) {
        toast.error("You must accept the contributor agreement.");
        return;
      }
      photographerMutation.mutate({
        name,
        email,
        password,
        promotionEmail,
        acceptedApproval,
        acceptedContributor,
      });
    }
  };

  const onChangeAccountType = (value: "surfer" | "photographer") => {
    setAccountType(value);
    if (onAccountTypeChange) {
      onAccountTypeChange(value);
    }
    if (value === "surfer") {
      setStep(1);
    }
  };

  return (
    <form
      className="mt-8 space-y-5 [font-family:var(--font-sf-pro)] sm:mt-10 md:mt-12"
      noValidate
      onSubmit={onSubmit}
    >
      <fieldset className="space-y-2">
        <legend className="text-text-strong text-sm font-medium">Account Type</legend>
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <label className="text-text-strong inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="accountType"
              value="surfer"
              checked={accountType === "surfer"}
              onChange={() => onChangeAccountType("surfer")}
              disabled={isPending}
              className="border-line-weak text-brand-default focus:ring-brand-default size-3.5"
            />
            Surfer
          </label>
          <label className="text-text-strong inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="accountType"
              value="photographer"
              checked={accountType === "photographer"}
              onChange={() => onChangeAccountType("photographer")}
              disabled={isPending}
              className="border-line-weak text-brand-default focus:ring-brand-default size-3.5"
            />
            Photographer
          </label>
        </div>
      </fieldset>

      {/* Photographer agreements moved into main signup step */}

      {step === 1 ? (
        <>
          <div className="space-y-2">
            <label htmlFor="full-name" className="text-text-strong text-base font-medium">
              Full name
            </label>
            <Input
              id="full-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-text-strong text-base font-medium">
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-text-strong text-base font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Type your password"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-icon-weaker absolute top-1/2 right-3 -translate-y-1/2"
                aria-label="Toggle password visibility"
                disabled={isPending}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <p className="text-text-weaker text-xs">Atleast 8 characters</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-text-strong text-base font-medium">
              Confirm password
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Retype your password"
                className="pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-icon-weaker absolute top-1/2 right-3 -translate-y-1/2"
                aria-label="Toggle confirm password visibility"
                disabled={isPending}
              >
                {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          <label className="text-text-weak inline-flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={promotionEmail}
              onChange={(e) => setPromotionEmail(e.target.checked)}
              disabled={isPending}
              className="border-line-weak text-brand-default focus:ring-brand-default size-3.5 rounded"
            />
            Allow promotions and updates to be sent via email.
          </label>
          {isPhotographer && (
            <div className="flex flex-col space-y-2 pt-4">
              <label className="text-text-weak inline-flex items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={acceptedApproval}
                  onChange={(e) => setAcceptedApproval(e.target.checked)}
                  disabled={isPending}
                  className="border-line-weak text-brand-default focus:ring-brand-default mt-0.5 size-3.5 rounded"
                />
                I understand that my first 10 uploads will require approval before going live.
              </label>

              <label className="text-text-weak inline-flex items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={acceptedContributor}
                  onChange={(e) => setAcceptedContributor(e.target.checked)}
                  disabled={isPending}
                  className="border-line-weak text-brand-default focus:ring-brand-default mt-0.5 size-3.5 rounded"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms-conditions"
                    className="text-brand-default underline-offset-2 hover:underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-brand-default underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>
          )}
        </>
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-4 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-text-weak order-2 text-sm md:order-1">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-default font-medium hover:underline">
              Log in
            </Link>
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover order-1 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 md:order-2 md:w-auto"
          >
            {isPending && !isPhotographer ? "Signing up..." : ctaLabel}
            <ArrowRight size={18} />
          </button>
        </div>
      ) : null}
    </form>
  );
}
