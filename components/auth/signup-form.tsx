"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api/client";

export function SignUpForm() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"surfer" | "photographer">("surfer");
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPhotographer = accountType === "photographer";

  const ctaLabel = useMemo(() => {
    if (step === 1 && isPhotographer) return "Next";
    return "Sign up";
  }, [isPhotographer, step]);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string> = { name, email, password };
      if (isPhotographer) {
        payload.paypalEmail = paypalEmail;
      }
      
      const endpoint = isPhotographer 
        ? "/users/register/photographer" 
        : "/users/register/surfer";

      const response = await apiClient.post(endpoint, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    },
    onError: (error: unknown) => {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An error occurred during registration.";
      toast.error(errorMessage);
    }
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (step === 1 && isPhotographer) {
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
      setStep(2);
      return;
    }

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
    } else {
      // Step 2 Photographer
      if (!paypalEmail) {
        toast.error("PayPal email is required for photographers.");
        return;
      }
    }

    registerMutation.mutate();
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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
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
            <Input 
              id="paypal-email" 
              type="email" 
              placeholder="Enter your PayPal Email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              disabled={registerMutation.isPending}
            />
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
              disabled={registerMutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-line-weaker px-4 py-2 text-sm font-medium text-text-weak transition-colors hover:bg-fill-weak disabled:opacity-50 sm:w-auto"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-default px-4 py-2 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover disabled:opacity-50 sm:w-auto"
            >
              {registerMutation.isPending ? "Signing up..." : "Sign up"}
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
            <Input 
              id="full-name" 
              type="text" 
              placeholder="Enter your full name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-base font-medium text-text-strong">
              Email
            </label>
            <Input 
              id="signup-email" 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-base font-medium text-text-strong">
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
                disabled={registerMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
                aria-label="Toggle password visibility"
                disabled={registerMutation.isPending}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Retype your password"
                className="pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={registerMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
                aria-label="Toggle confirm password visibility"
                disabled={registerMutation.isPending}
              >
                {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
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
          <p className="order-2 text-sm text-text-weak md:order-1">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-default hover:underline">
              Log in
            </Link>
          </p>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="order-1 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-default px-4 py-2 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover disabled:opacity-50 md:order-2 md:w-auto"
          >
            {registerMutation.isPending && !isPhotographer ? "Signing up..." : ctaLabel}
            <ArrowRight size={18} />
          </button>
        </div>
      ) : null}
    </form>
  );
}
