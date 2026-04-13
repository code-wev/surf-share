"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SignUpForm() {
  const [accountType, setAccountType] = useState<"surfer" | "photographer">("surfer");
  const [step, setStep] = useState<1 | 2>(1);

  const isPhotographer = accountType === "photographer";
  const ctaLabel = useMemo(() => {
    if (step === 1 && isPhotographer) return "Next";
    return "Sign up";
  }, [isPhotographer, step]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (step === 1 && isPhotographer) {
      event.preventDefault();
      setStep(2);
      return;
    }
  };

  const onChangeAccountType = (value: "surfer" | "photographer") => {
    setAccountType(value);
    if (value === "surfer") {
      setStep(1);
    }
  };

  return (
    <form
      className="mt-8 space-y-5 sm:mt-10 md:mt-12 [font-family:var(--font-sf-pro)]"
      noValidate
      onSubmit={onSubmit}
    >
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-text-strong">Account Type</legend>
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <label className="inline-flex items-center gap-2 text-sm text-text-strong">
            <input
              type="radio"
              name="accountType"
              value="surfer"
              checked={accountType === "surfer"}
              onChange={() => onChangeAccountType("surfer")}
              className="size-3.5 border-line-weak text-brand-default focus:ring-brand-default"
            />
            Surfer
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-text-strong">
            <input
              type="radio"
              name="accountType"
              value="photographer"
              checked={accountType === "photographer"}
              onChange={() => onChangeAccountType("photographer")}
              className="size-3.5 border-line-weak text-brand-default focus:ring-brand-default"
            />
            Photographer
          </label>
        </div>
      </fieldset>

      {step === 2 && isPhotographer ? (
        <div className="space-y-5 p-4 sm:p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.14em] text-text-weaker uppercase">
              <span>Step 2 of 2</span>
              <span className="tracking-normal normal-case">Payment Setup</span>
            </div>
            <div className="h-0.5 w-full bg-line-weaker">
              <div className="h-full w-full bg-brand-default" />
            </div>
          </div>

          <p className="text-xs leading-5 text-text-weak sm:text-sm">
            Enter your PayPal email to receive payments. Payouts are processed
            automatically when your photos sell.
          </p>

          <div className="space-y-2">
            <label htmlFor="paypal-email" className="text-base font-medium text-text-strong">
              PayPal Email
            </label>
            <Input id="paypal-email" type="email" placeholder="Enter your PayPal Email" />
          </div>

          <p className="inline-flex items-start gap-1.5 text-xs text-alert-strong">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>
              Note: Ensure this email matches your active PayPal account. Platform
              commission is deducted automatically before payout.
            </span>
          </p>

          <div className="space-y-2">
            <label className="inline-flex items-start gap-2 text-xs text-text-weak">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 size-3.5 rounded border-line-weak text-brand-default focus:ring-brand-default"
              />
              I understand that my first 10 uploads will require approval before going
              live.
            </label>

            <label className="inline-flex items-start gap-2 text-xs text-text-weak">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 size-3.5 rounded border-line-weak text-brand-default focus:ring-brand-default"
              />
              I agree to the{" "}
              <Link href="#" className="text-brand-default underline-offset-2 hover:underline">
                pricing structure
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-brand-default underline-offset-2 hover:underline">
                contributor agreement
              </Link>
              .
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-line-weaker px-4 py-2 text-sm font-medium text-text-weak transition-colors hover:bg-fill-weak sm:w-auto"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-default px-4 py-2 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover sm:w-auto"
            >
              Sign up
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <>
          <div className="space-y-2">
            <label htmlFor="full-name" className="text-base font-medium text-text-strong">
              Full name
            </label>
            <Input id="full-name" type="text" placeholder="Enter your full name" />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-base font-medium text-text-strong">
              Email
            </label>
            <Input id="signup-email" type="email" placeholder="Enter your email address" />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-base font-medium text-text-strong">
              Password
            </label>
            <div className="relative">
              <Input
                id="signup-password"
                type="password"
                placeholder="Type your password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
                aria-label="Toggle password visibility"
              >
                <EyeOff size={16} />
              </button>
            </div>
            <p className="text-xs text-text-weaker">Atleast 8 characters</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-base font-medium text-text-strong">
              Confirm password
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type="password"
                placeholder="Retype your password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
                aria-label="Toggle confirm password visibility"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-text-weak">
            <input
              type="checkbox"
              defaultChecked
              className="size-3.5 rounded border-line-weak text-brand-default focus:ring-brand-default"
            />
            Allow promotions and updates to be sent via email.
          </label>
        </>
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-4 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-text-weak">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-default hover:underline">
              Log in
            </Link>
          </p>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-default px-4 py-2 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover md:w-auto"
          >
            {ctaLabel}
            <ArrowRight size={18} />
          </button>
        </div>
      ) : null}
    </form>
  );
}